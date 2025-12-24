import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Worker, Team } from '../../types';

interface WorkforceState {
  workers: Worker[];
  teams: Team[];
  selectedWorker: Worker | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkforceState = {
  workers: [],
  teams: [],
  selectedWorker: null,
  isLoading: false,
  error: null,
};

const workforceSlice = createSlice({
  name: 'workforce',
  initialState,
  reducers: {
    setWorkers: (state, action: PayloadAction<Worker[]>) => {
      state.workers = action.payload;
      state.error = null;
    },
    addWorker: (state, action: PayloadAction<Worker>) => {
      state.workers.push(action.payload);
    },
    updateWorker: (state, action: PayloadAction<Worker>) => {
      const index = state.workers.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workers[index] = action.payload;
      }
      if (state.selectedWorker?.id === action.payload.id) {
        state.selectedWorker = action.payload;
      }
    },
    deleteWorker: (state, action: PayloadAction<string>) => {
      state.workers = state.workers.filter(w => w.id !== action.payload);
      if (state.selectedWorker?.id === action.payload) {
        state.selectedWorker = null;
      }
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(t => t.id !== action.payload);
    },
    setSelectedWorker: (state, action: PayloadAction<Worker | null>) => {
      state.selectedWorker = action.payload;
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
  setWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  setTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  setSelectedWorker,
  setLoading,
  setError,
} = workforceSlice.actions;
export default workforceSlice.reducer;
