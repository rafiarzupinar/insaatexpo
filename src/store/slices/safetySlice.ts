import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SafetyChecklist, Incident, RiskArea } from '../../types';

interface SafetyState {
  checklists: SafetyChecklist[];
  incidents: Incident[];
  riskAreas: RiskArea[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SafetyState = {
  checklists: [],
  incidents: [],
  riskAreas: [],
  isLoading: false,
  error: null,
};

const safetySlice = createSlice({
  name: 'safety',
  initialState,
  reducers: {
    setChecklists: (state, action: PayloadAction<SafetyChecklist[]>) => {
      state.checklists = action.payload;
      state.error = null;
    },
    addChecklist: (state, action: PayloadAction<SafetyChecklist>) => {
      state.checklists.push(action.payload);
    },
    updateChecklist: (state, action: PayloadAction<SafetyChecklist>) => {
      const index = state.checklists.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.checklists[index] = action.payload;
      }
    },
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload;
    },
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.push(action.payload);
    },
    updateIncident: (state, action: PayloadAction<Incident>) => {
      const index = state.incidents.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
    },
    setRiskAreas: (state, action: PayloadAction<RiskArea[]>) => {
      state.riskAreas = action.payload;
    },
    addRiskArea: (state, action: PayloadAction<RiskArea>) => {
      state.riskAreas.push(action.payload);
    },
    updateRiskArea: (state, action: PayloadAction<RiskArea>) => {
      const index = state.riskAreas.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.riskAreas[index] = action.payload;
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
  setChecklists,
  addChecklist,
  updateChecklist,
  setIncidents,
  addIncident,
  updateIncident,
  setRiskAreas,
  addRiskArea,
  updateRiskArea,
  setLoading,
  setError,
} = safetySlice.actions;
export default safetySlice.reducer;
