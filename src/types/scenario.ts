export interface Position {
  x: number;
  y: number;
  z: number;
  lat?: number;
  lon?: number;
  alt?: number;
}

export interface Waypoint extends Position {
  timestamp?: number;
  speed?: number;
}

export interface NetworkConfig {
  networkId: string;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  protocol?: string;
  frequency?: number;
  bandwidth?: number;
  power?: number;
}

export interface RadioConfig {
  frequency: number;
  power: number; // in watts
  range: number; // in meters
  antenna?: {
    type: string;
    gain: number; // in dBi
    beamwidth?: number;
  };
  modulation?: string;
  dataRate?: number; // in Mbps
}

export type NodeType = 
  | 'ROUTER' 
  | 'SWITCH' 
  | 'HOST' 
  | 'SERVER' 
  | 'GATEWAY' 
  | 'JAMMER' 
  | 'SENSOR' 
  | 'MOBILE';

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  position: Position;
  configuration: {
    network: NetworkConfig;
    radio?: RadioConfig;
    [key: string]: any;
  };
  networkId?: string;
  movementPath?: Waypoint[];
  unitId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  position: Position;
  configuration: {
    network?: NetworkConfig;
    radio?: RadioConfig;
    [key: string]: any;
  };
  networkId?: string;
  movementPath?: Waypoint[];
  radioRange?: number;
  nodeCount: number;
  nodes?: Node[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileType = 
  | 'HTTP' 
  | 'FTP' 
  | 'EMAIL' 
  | 'VIDEO' 
  | 'VOICE' 
  | 'DATA' 
  | 'CUSTOM';

export interface TrafficProfile {
  id: string;
  name: string;
  profileType: ProfileType;
  configuration: {
    bandwidth?: number; // Mbps
    protocol?: string;
    packetSize?: number;
    interval?: number;
    duration?: number;
    [key: string]: any;
  };
  senderNodeId?: string;
  senderUnitId?: string;
  receiverNodeId?: string;
  receiverUnitId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  data: {
    terrain?: {
      center: Position;
      bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
      elevationData?: any;
    };
    networks: NetworkConfig[];
    pathLossModel?: string;
    environmentalFactors?: {
      weather?: string;
      interference?: number;
      [key: string]: any;
    };
  };
  isTemplate: boolean;
  isPublic: boolean;
  userId: string;
  nodes?: Node[];
  units?: Unit[];
  trafficProfiles?: TrafficProfile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScenarioTemplate {
  name: string;
  description: string;
  category: string;
  data: Partial<Scenario['data']>;
  nodes: Partial<Node>[];
  units: Partial<Unit>[];
  trafficProfiles: Partial<TrafficProfile>[];
}

// For drag and drop in the UI
export interface DragItem {
  type: 'node' | 'unit' | 'traffic';
  data: Partial<Node> | Partial<Unit> | Partial<TrafficProfile>;
}

// Map interaction states
export interface MapState {
  center: Position;
  zoom: number;
  mode: '2D' | '3D';
  selectedEntity?: string;
  selectedType?: 'node' | 'unit';
  terrainEnabled: boolean;
  rulerActive: boolean;
  measurementPoints: Position[];
}