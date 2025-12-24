import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report } from '../../types';

interface ReportsState {
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
      state.error = null;
    },
    addReport: (state, action: PayloadAction<Report>) => {
      state.reports.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(r => r.id !== action.payload);
      if (state.selectedReport?.id === action.payload) {
        state.selectedReport = null;
      }
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
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
  setReports,
  addReport,
  updateReport,
  deleteReport,
  setSelectedReport,
  setLoading,
  setError,
} = reportsSlice.actions;
export default reportsSlice.reducer;
