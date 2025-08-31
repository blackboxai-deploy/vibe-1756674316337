// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication API types
export interface LoginResponse extends ApiResponse<{
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  token: string;
}> {}

// AI Generation API types
export interface AIGenerationRequest {
  prompt: string;
  context?: {
    scenarioType?: string;
    nodeCount?: number;
    areaSize?: number;
    requirements?: string[];
  };
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface AIGenerationResponse extends ApiResponse<{
  scenario: {
    name: string;
    description: string;
    nodes: any[];
    units: any[];
    networks: any[];
    trafficProfiles: any[];
  };
  confidence: number;
  generationTime: number;
}> {}

// Scenario API types
export interface ScenarioListResponse extends PaginatedResponse<{
  id: string;
  name: string;
  description?: string;
  isTemplate: boolean;
  isPublic: boolean;
  nodeCount: number;
  unitCount: number;
  createdAt: string;
  updatedAt: string;
}> {}

export interface ScenarioExportFormat {
  version: string;
  metadata: {
    name: string;
    description?: string;
    exportedAt: string;
    exportedBy: string;
    originalId?: string;
  };
  scenario: {
    data: any;
    nodes: any[];
    units: any[];
    trafficProfiles: any[];
  };
}

// Simulation API types
export interface SimulationStartRequest {
  scenarioId: string;
  name: string;
  duration?: number;
  priority?: number;
  options?: {
    enablePathLoss?: boolean;
    terrainAnalysis?: boolean;
    detailedLogging?: boolean;
  };
}

export interface SimulationStatusResponse extends ApiResponse<{
  id: string;
  status: string;
  progress: number;
  currentTime?: number;
  estimatedEndTime?: string;
  events?: any[];
  metrics?: any;
}> {}

// Map and terrain API types
export interface TerrainQuery {
  positions: Array<{
    longitude: number;
    latitude: number;
  }>;
}

export interface TerrainResponse extends ApiResponse<Array<{
  longitude: number;
  latitude: number;
  elevation: number;
}>> {}

export interface PathLossCalculation {
  from: {
    id: string;
    position: {
      longitude: number;
      latitude: number;
      elevation: number;
    };
    power: number; // transmit power in watts
    frequency: number; // frequency in MHz
  };
  to: {
    id: string;
    position: {
      longitude: number;
      latitude: number;
      elevation: number;
    };
  };
}

export interface PathLossResponse extends ApiResponse<{
  distance: number; // meters
  freeSpaceLoss: number; // dB
  terrainLoss: number; // dB
  totalPathLoss: number; // dB
  receivedPower: number; // dBm
  linkBudget: number; // dB
  feasible: boolean;
  terrainProfile: Array<{
    distance: number;
    elevation: number;
  }>;
}> {}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  validationErrors?: ValidationError[];
}