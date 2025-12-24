import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: {
    status: string | null;
    priority: string | null;
    projectId: string | null;
  };
}

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  filteredTasks: [],
  isLoading: false,
  error: null,
  filter: {
    status: null,
    priority: null,
    projectId: null,
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.filteredTasks = action.payload;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      state.filteredTasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      const filteredIndex = state.filteredTasks.findIndex(t => t.id === action.payload.id);
      if (filteredIndex !== -1) {
        state.filteredTasks[filteredIndex] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      state.filteredTasks = state.filteredTasks.filter(t => t.id !== action.payload);
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
      }
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<TasksState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
      // Apply filters
      let filtered = [...state.tasks];
      if (state.filter.status) {
        filtered = filtered.filter(t => t.status === state.filter.status);
      }
      if (state.filter.priority) {
        filtered = filtered.filter(t => t.priority === state.filter.priority);
      }
      if (state.filter.projectId) {
        filtered = filtered.filter(t => t.projectId === state.filter.projectId);
      }
      state.filteredTasks = filtered;
    },
    clearFilters: (state) => {
      state.filter = { status: null, priority: null, projectId: null };
      state.filteredTasks = state.tasks;
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
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setFilter,
  clearFilters,
  setLoading,
  setError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
