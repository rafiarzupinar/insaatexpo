import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectPhase } from '../../types';

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      state.error = null;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      if (state.selectedProject?.id === action.payload.id) {
        state.selectedProject = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.selectedProject?.id === action.payload) {
        state.selectedProject = null;
      }
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    updateProjectPhase: (state, action: PayloadAction<{ projectId: string; phase: ProjectPhase }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        const phaseIndex = project.phases.findIndex(ph => ph.id === action.payload.phase.id);
        if (phaseIndex !== -1) {
          project.phases[phaseIndex] = action.payload.phase;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  updateProjectPhase,
  setLoading,
  setError,
} = projectsSlice.actions;
export default projectsSlice.reducer;
