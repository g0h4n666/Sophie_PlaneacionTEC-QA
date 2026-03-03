import { create } from 'zustand';

interface Step6WorkspaceState {
  isWorkspaceOpen: boolean;
  isControlsCollapsed: boolean;
  selectedScenarioId: number | null;
  selectedProjectId: string | null;
  openWorkspace: () => void;
  closeWorkspace: () => void;
  toggleControls: () => void;
  setSelectedScenarioId: (id: number | null) => void;
  setSelectedProjectId: (id: string | null) => void;
}

export const useStep6WorkspaceStore = create<Step6WorkspaceState>((set) => ({
  isWorkspaceOpen: false,
  isControlsCollapsed: false,
  selectedScenarioId: null,
  selectedProjectId: null,
  openWorkspace: () => set({ isWorkspaceOpen: true }),
  closeWorkspace: () => set({ isWorkspaceOpen: false, selectedProjectId: null }),
  toggleControls: () => set((state) => ({ isControlsCollapsed: !state.isControlsCollapsed })),
  setSelectedScenarioId: (id) => set({ selectedScenarioId: id }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id })
}));
