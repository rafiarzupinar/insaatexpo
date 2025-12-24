import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget, Expense } from '../../types';

interface FinanceState {
  budgets: Budget[];
  expenses: Expense[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
  summary: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    profitMargin: number;
  };
}

const initialState: FinanceState = {
  budgets: [],
  expenses: [],
  selectedBudget: null,
  isLoading: false,
  error: null,
  summary: {
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    profitMargin: 0,
  },
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
      state.error = null;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
    setSelectedBudget: (state, action: PayloadAction<Budget | null>) => {
      state.selectedBudget = action.payload;
    },
    updateSummary: (state, action: PayloadAction<FinanceState['summary']>) => {
      state.summary = action.payload;
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
  setBudgets,
  addBudget,
  updateBudget,
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setSelectedBudget,
  updateSummary,
  setLoading,
  setError,
} = financeSlice.actions;
export default financeSlice.reducer;
