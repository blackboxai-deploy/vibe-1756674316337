export type SimulationStatus = 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  entityId?: string;
  entityType?: 'node' | 'unit';
  data: {
    position?: {
      x: number;
      y: number;
      z: number;
    };
    networkMetrics?: {
      throughput?: number;
      latency?: number;
      packetLoss?: number;
      signalStrength?: number;
    };
    [key: string]: any;
  };
}

export interface SimulationResults {
  metrics: {
    totalDuration: number; // seconds
    totalEvents: number;
    networkStats: {
      totalDataTransferred: number; // MB
      averageThroughput: number; // Mbps
      averageLatency: number; // ms
      packetLossRate: number; // percentage
    };
    nodeStats: {
      [nodeId: string]: {
        dataReceived: number;
        dataSent: number;
        connectionTime: number;
        signalQuality: number;
      };
    };
  };
  pathLossAnalysis?: {
    [linkId: string]: {
      freeSpaceLoss: number; // dB
      terrainLoss: number; // dB
      totalLoss: number; // dB
      linkBudget: number; // dB
    };
  };
  timeline: SimulationEvent[];
}

export interface Simulation {
  id: string;
  name: string;
  status: SimulationStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // Duration in seconds
  results?: SimulationResults;
  priority: number;
  scenarioId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationRun {
  id: string;
  name: string;
  status: SimulationStatus;
  progress: number; // 0-100
  startTime?: Date;
  estimatedEndTime?: Date;
  priority: number;
  canCancel: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // seconds from simulation start
  totalTime: number;
  playbackSpeed: number; // 1.0 = normal speed
  events: SimulationEvent[];
  activeEventIndex: number;
}

// Regression testing
export interface RegressionTest {
  id: string;
  name: string;
  description?: string;
  baselineSimulationId: string;
  testScenarios: string[]; // scenario IDs
  metrics: {
    throughputTolerance: number; // percentage
    latencyTolerance: number; // percentage
    packetLossTolerance: number; // percentage
  };
  results?: RegressionTestResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RegressionTestResult {
  scenarioId: string;
  simulationId: string;
  passed: boolean;
  deviations: {
    throughput: number; // percentage deviation
    latency: number;
    packetLoss: number;
  };
  issues: string[];
  timestamp: Date;
}