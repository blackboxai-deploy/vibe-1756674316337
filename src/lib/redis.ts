import { createClient } from 'redis';

declare global {
  var redisClient: ReturnType<typeof createClient> | undefined;
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = globalThis.redisClient || createClient({
  url: redisUrl,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.redisClient = redisClient;
}

// Connection handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

// Initialize connection
export async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }
  return redisClient;
}

// Cache utilities
export class Cache {
  private static client = redisClient;

  // Get value from cache
  static async get<T = any>(key: string): Promise<T | null> {
    try {
      await connectRedis();
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set value in cache
  static async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      await connectRedis();
      const serialized = JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete from cache
  static async del(key: string): Promise<boolean> {
    try {
      await connectRedis();
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    try {
      await connectRedis();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set with expiration
  static async setWithTTL(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    return this.set(key, value, ttlSeconds);
  }

  // Get remaining TTL
  static async getTTL(key: string): Promise<number> {
    try {
      await connectRedis();
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  }

  // Flush all cache
  static async flushAll(): Promise<boolean> {
    try {
      await connectRedis();
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Session management
export class SessionStore {
  private static prefix = 'session:';
  
  static async createSession(userId: string, sessionData: any, ttlSeconds = 7 * 24 * 60 * 60): Promise<string> {
    const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const key = this.prefix + sessionId;
    
    await Cache.set(key, { userId, ...sessionData }, ttlSeconds);
    return sessionId;
  }

  static async getSession(sessionId: string): Promise<any | null> {
    const key = this.prefix + sessionId;
    return Cache.get(key);
  }

  static async updateSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = this.prefix + sessionId;
    const existingTTL = await Cache.getTTL(key);
    
    if (existingTTL > 0) {
      return Cache.set(key, sessionData, existingTTL);
    }
    
    return Cache.set(key, sessionData);
  }

  static async destroySession(sessionId: string): Promise<boolean> {
    const key = this.prefix + sessionId;
    return Cache.del(key);
  }
}

export { redisClient };
export default Cache;