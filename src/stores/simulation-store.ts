'use client';

import { create } from 'zustand';
import type { 
  Simulation, 
  SimulationRun, 
  PlaybackState, 
  RegressionTest 
} from '@/types';

interface SimulationState {
  // Simulations
  simulations: Simulation[];
  currentSimulation: Simulation | null;
  activeRuns: SimulationRun[];
  
  // Playback
  playbackState: PlaybackState | null;
  
  // Regression testing
  regressionTests: RegressionTest[];
  
  // UI state
  runsMenuOpen: boolean;
  playbackOpen: boolean;
  
  // Actions
  setSimulations: (simulations: Simulation[]) => void;
  addSimulation: (simulation: Simulation) => void;
  updateSimulation: (simulationId: string, updates: Partial<Simulation>) => void;
  deleteSimulation: (simulationId: string) => void;
  setCurrentSimulation: (simulation: Simulation | null) => void;
  
  // Active runs management
  setActiveRuns: (runs: SimulationRun[]) => void;
  updateRunStatus: (runId: string, updates: Partial<SimulationRun>) => void;
  cancelRun: (runId: string) => void;
  
  // Playback controls
  setPlaybackState: (state: PlaybackState | null) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  nextEvent: () => void;
  previousEvent: () => void;
  
  // Regression testing
  setRegressionTests: (tests: RegressionTest[]) => void;
  addRegressionTest: (test: RegressionTest) => void;
  updateRegressionTest: (testId: string, updates: Partial<RegressionTest>) => void;
  deleteRegressionTest: (testId: string) => void;
  
  // UI controls
  setRunsMenuOpen: (open: boolean) => void;
  setPlaybackOpen: (open: boolean) => void;
  
  // Reset
  reset: () => void;
}

const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  currentTime: 0,
  totalTime: 0,
  playbackSpeed: 1.0,
  events: [],
  activeEventIndex: -1,
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial state
  simulations: [],
  currentSimulation: null,
  activeRuns: [],
  playbackState: null,
  regressionTests: [],
  runsMenuOpen: false,
  playbackOpen: false,

  // Simulation management
  setSimulations: (simulations) => {
    set({ simulations });
  },

  addSimulation: (simulation) => {
    set((state) => ({
      simulations: [...state.simulations, simulation],
    }));
  },

  updateSimulation: (simulationId, updates) => {
    set((state) => ({
      simulations: state.simulations.map((sim) =>
        sim.id === simulationId ? { ...sim, ...updates } : sim
      ),
      currentSimulation:
        state.currentSimulation?.id === simulationId
          ? { ...state.currentSimulation, ...updates }
          : state.currentSimulation,
    }));
  },

  deleteSimulation: (simulationId) => {
    set((state) => ({
      simulations: state.simulations.filter((sim) => sim.id !== simulationId),
      currentSimulation:
        state.currentSimulation?.id === simulationId
          ? null
          : state.currentSimulation,
    }));
  },

  setCurrentSimulation: (simulation) => {
    set({ currentSimulation: simulation });
    
    // Initialize playback state if simulation has results
    if (simulation?.results?.timeline) {
      const events = simulation.results.timeline;
      const totalTime = Math.max(...events.map(e => new Date(e.timestamp).getTime())) - 
                       Math.min(...events.map(e => new Date(e.timestamp).getTime()));
      
      set({
        playbackState: {
          ...initialPlaybackState,
          events,
          totalTime: totalTime / 1000, // Convert to seconds
        },
      });
    } else {
      set({ playbackState: null });
    }
  },

  // Active runs management
  setActiveRuns: (runs) => {
    set({ activeRuns: runs });
  },

  updateRunStatus: (runId, updates) => {
    set((state) => ({
      activeRuns: state.activeRuns.map((run) =>
        run.id === runId ? { ...run, ...updates } : run
      ),
    }));
  },

  cancelRun: (runId) => {
    set((state) => ({
      activeRuns: state.activeRuns.map((run) =>
        run.id === runId
          ? { ...run, status: 'CANCELLED', canCancel: false }
          : run
      ),
    }));
  },

  // Playback controls
  setPlaybackState: (state) => {
    set({ playbackState: state });
  },

  play: () => {
    set((state) => ({
      playbackState: state.playbackState
        ? { ...state.playbackState, isPlaying: true }
        : null,
    }));
  },

  pause: () => {
    set((state) => ({
      playbackState: state.playbackState
        ? { ...state.playbackState, isPlaying: false }
        : null,
    }));
  },

  stop: () => {
    set((state) => ({
      playbackState: state.playbackState
        ? {
            ...state.playbackState,
            isPlaying: false,
            currentTime: 0,
            activeEventIndex: -1,
          }
        : null,
    }));
  },

  seekTo: (time) => {
    set((state) => {
      if (!state.playbackState) return state;

      // Find the active event index based on time
      const events = state.playbackState.events;
      const startTime = Math.min(...events.map(e => new Date(e.timestamp).getTime()));
      const targetTime = startTime + time * 1000;
      
      let activeEventIndex = -1;
      for (let i = 0; i < events.length; i++) {
        if (new Date(events[i].timestamp).getTime() <= targetTime) {
          activeEventIndex = i;
        } else {
          break;
        }
      }

      return {
        playbackState: {
          ...state.playbackState,
          currentTime: time,
          activeEventIndex,
        },
      };
    });
  },

  setPlaybackSpeed: (speed) => {
    set((state) => ({
      playbackState: state.playbackState
        ? { ...state.playbackState, playbackSpeed: speed }
        : null,
    }));
  },

  nextEvent: () => {
    set((state) => {
      if (!state.playbackState || 
          state.playbackState.activeEventIndex >= state.playbackState.events.length - 1) {
        return state;
      }

      const nextIndex = state.playbackState.activeEventIndex + 1;
      const nextEvent = state.playbackState.events[nextIndex];
      const startTime = Math.min(...state.playbackState.events.map(e => new Date(e.timestamp).getTime()));
      const nextEventTime = (new Date(nextEvent.timestamp).getTime() - startTime) / 1000;

      return {
        playbackState: {
          ...state.playbackState,
          activeEventIndex: nextIndex,
          currentTime: nextEventTime,
        },
      };
    });
  },

  previousEvent: () => {
    set((state) => {
      if (!state.playbackState || state.playbackState.activeEventIndex <= 0) {
        return state;
      }

      const prevIndex = state.playbackState.activeEventIndex - 1;
      const prevEvent = state.playbackState.events[prevIndex];
      const startTime = Math.min(...state.playbackState.events.map(e => new Date(e.timestamp).getTime()));
      const prevEventTime = (new Date(prevEvent.timestamp).getTime() - startTime) / 1000;

      return {
        playbackState: {
          ...state.playbackState,
          activeEventIndex: prevIndex,
          currentTime: prevEventTime,
        },
      };
    });
  },

  // Regression testing
  setRegressionTests: (tests) => {
    set({ regressionTests: tests });
  },

  addRegressionTest: (test) => {
    set((state) => ({
      regressionTests: [...state.regressionTests, test],
    }));
  },

  updateRegressionTest: (testId, updates) => {
    set((state) => ({
      regressionTests: state.regressionTests.map((test) =>
        test.id === testId ? { ...test, ...updates } : test
      ),
    }));
  },

  deleteRegressionTest: (testId) => {
    set((state) => ({
      regressionTests: state.regressionTests.filter((test) => test.id !== testId),
    }));
  },

  // UI controls
  setRunsMenuOpen: (open) => {
    set({ runsMenuOpen: open });
  },

  setPlaybackOpen: (open) => {
    set({ playbackOpen: open });
  },

  // Reset
  reset: () => {
    set({
      simulations: [],
      currentSimulation: null,
      activeRuns: [],
      playbackState: null,
      regressionTests: [],
      runsMenuOpen: false,
      playbackOpen: false,
    });
  },
}));