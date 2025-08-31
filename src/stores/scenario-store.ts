'use client';

import { create } from 'zustand';
import type { 
  Scenario, 
  Node, 
  Unit, 
  TrafficProfile, 
  MapState, 
  DragItem 
} from '@/types';

interface ScenarioState {
  // Current scenario
  currentScenario: Scenario | null;
  scenarios: Scenario[];
  
  // Editor state
  selectedEntity: { id: string; type: 'node' | 'unit' } | null;
  isEditing: boolean;
  
  // Map state
  mapState: MapState;
  
  // Drag and drop
  dragItem: DragItem | null;
  
  // Actions
  setCurrentScenario: (scenario: Scenario | null) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  addScenario: (scenario: Scenario) => void;
  updateScenario: (scenarioId: string, updates: Partial<Scenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  
  // Entity management
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  
  addUnit: (unit: Unit) => void;
  updateUnit: (unitId: string, updates: Partial<Unit>) => void;
  deleteUnit: (unitId: string) => void;
  
  addTrafficProfile: (traffic: TrafficProfile) => void;
  updateTrafficProfile: (trafficId: string, updates: Partial<TrafficProfile>) => void;
  deleteTrafficProfile: (trafficId: string) => void;
  
  // Selection
  selectEntity: (id: string, type: 'node' | 'unit') => void;
  clearSelection: () => void;
  
  // Map controls
  updateMapState: (updates: Partial<MapState>) => void;
  
  // Drag and drop
  setDragItem: (item: DragItem | null) => void;
  
  // Editor state
  setEditing: (editing: boolean) => void;
  
  // Reset
  reset: () => void;
}

const initialMapState: MapState = {
  center: { x: 0, y: 0, z: 0 },
  zoom: 10,
  mode: '3D',
  terrainEnabled: true,
  rulerActive: false,
  measurementPoints: [],
};

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  // Initial state
  currentScenario: null,
  scenarios: [],
  selectedEntity: null,
  isEditing: false,
  mapState: initialMapState,
  dragItem: null,

  // Scenario management
  setCurrentScenario: (scenario) => {
    set({ currentScenario: scenario });
  },

  setScenarios: (scenarios) => {
    set({ scenarios });
  },

  addScenario: (scenario) => {
    set((state) => ({
      scenarios: [...state.scenarios, scenario],
    }));
  },

  updateScenario: (scenarioId, updates) => {
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === scenarioId ? { ...s, ...updates } : s
      ),
      currentScenario:
        state.currentScenario?.id === scenarioId
          ? { ...state.currentScenario, ...updates }
          : state.currentScenario,
    }));
  },

  deleteScenario: (scenarioId) => {
    set((state) => ({
      scenarios: state.scenarios.filter((s) => s.id !== scenarioId),
      currentScenario:
        state.currentScenario?.id === scenarioId
          ? null
          : state.currentScenario,
    }));
  },

  // Node management
  addNode: (node) => {
    set((state) => {
      if (!state.currentScenario) return state;
      
      const updatedScenario = {
        ...state.currentScenario,
        nodes: [...(state.currentScenario.nodes || []), node],
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  updateNode: (nodeId, updates) => {
    set((state) => {
      if (!state.currentScenario?.nodes) return state;
      
      const updatedNodes = state.currentScenario.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        nodes: updatedNodes,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  deleteNode: (nodeId) => {
    set((state) => {
      if (!state.currentScenario?.nodes) return state;
      
      const updatedNodes = state.currentScenario.nodes.filter(
        (node) => node.id !== nodeId
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        nodes: updatedNodes,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
        selectedEntity:
          state.selectedEntity?.id === nodeId ? null : state.selectedEntity,
      };
    });
  },

  // Unit management
  addUnit: (unit) => {
    set((state) => {
      if (!state.currentScenario) return state;
      
      const updatedScenario = {
        ...state.currentScenario,
        units: [...(state.currentScenario.units || []), unit],
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  updateUnit: (unitId, updates) => {
    set((state) => {
      if (!state.currentScenario?.units) return state;
      
      const updatedUnits = state.currentScenario.units.map((unit) =>
        unit.id === unitId ? { ...unit, ...updates } : unit
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        units: updatedUnits,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  deleteUnit: (unitId) => {
    set((state) => {
      if (!state.currentScenario?.units) return state;
      
      const updatedUnits = state.currentScenario.units.filter(
        (unit) => unit.id !== unitId
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        units: updatedUnits,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
        selectedEntity:
          state.selectedEntity?.id === unitId ? null : state.selectedEntity,
      };
    });
  },

  // Traffic profile management
  addTrafficProfile: (traffic) => {
    set((state) => {
      if (!state.currentScenario) return state;
      
      const updatedScenario = {
        ...state.currentScenario,
        trafficProfiles: [...(state.currentScenario.trafficProfiles || []), traffic],
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  updateTrafficProfile: (trafficId, updates) => {
    set((state) => {
      if (!state.currentScenario?.trafficProfiles) return state;
      
      const updatedTraffic = state.currentScenario.trafficProfiles.map((traffic) =>
        traffic.id === trafficId ? { ...traffic, ...updates } : traffic
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        trafficProfiles: updatedTraffic,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  deleteTrafficProfile: (trafficId) => {
    set((state) => {
      if (!state.currentScenario?.trafficProfiles) return state;
      
      const updatedTraffic = state.currentScenario.trafficProfiles.filter(
        (traffic) => traffic.id !== trafficId
      );
      
      const updatedScenario = {
        ...state.currentScenario,
        trafficProfiles: updatedTraffic,
      };
      
      return {
        currentScenario: updatedScenario,
        scenarios: state.scenarios.map((s) =>
          s.id === state.currentScenario?.id ? updatedScenario : s
        ),
      };
    });
  },

  // Entity selection
  selectEntity: (id, type) => {
    set({ selectedEntity: { id, type } });
  },

  clearSelection: () => {
    set({ selectedEntity: null });
  },

  // Map state management
  updateMapState: (updates) => {
    set((state) => ({
      mapState: { ...state.mapState, ...updates },
    }));
  },

  // Drag and drop
  setDragItem: (item) => {
    set({ dragItem: item });
  },

  // Editor state
  setEditing: (editing) => {
    set({ isEditing: editing });
  },

  // Reset all state
  reset: () => {
    set({
      currentScenario: null,
      scenarios: [],
      selectedEntity: null,
      isEditing: false,
      mapState: initialMapState,
      dragItem: null,
    });
  },
}));