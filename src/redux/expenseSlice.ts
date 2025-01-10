import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '@/redux/store';

// Define the Expense interface
export interface Expense {
  _id?: string;
  amount: number;
  category: string;
  purpose: string;
  date: string;
}

// Define the state interface
interface ExpenseState {
  expenses: Expense[];
  limits: Record<string, number>;
  limitResetDate: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Key for local storage
const LIMITS_KEY = 'expense_limits';
const RESET_DATE_KEY = 'limit_reset_date';

// Default limits for each category
const defaultLimits: Record<string, number> = {
  Groceries: 0,
  Transportation: 0,
  Healthcare: 0,
  Utility: 0,
  Charity: 0,
  Miscellaneous: 0,
};

// Utility functions for local storage
const saveLimitsToLocalStorage = (limits: Record<string, number>, resetDate: string) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem(LIMITS_KEY, JSON.stringify(limits));
    localStorage.setItem(RESET_DATE_KEY, resetDate);
  }
};

const loadLimitsFromLocalStorage = (): { limits: Record<string, number>; resetDate: string | null } => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const storedLimits = localStorage.getItem(LIMITS_KEY);
    const storedDate = localStorage.getItem(RESET_DATE_KEY);
    return {
      limits: storedLimits ? JSON.parse(storedLimits) : { ...defaultLimits },
      resetDate: storedDate || null,
    };
  }

  return { limits: { ...defaultLimits }, resetDate: null };
};

// Check if a month has passed since the last reset
const isMonthElapsed = (lastResetDate: string | null): boolean => {
  if (!lastResetDate) return true;
  const lastReset = new Date(lastResetDate);
  const now = new Date();
  const diffInMonths = now.getMonth() - lastReset.getMonth() + 12 * (now.getFullYear() - lastReset.getFullYear());
  return diffInMonths >= 1;
};

// Initial state
const initialState: ExpenseState = {
  expenses: [],
  ...loadLimitsFromLocalStorage(),
  status: 'idle',
  error: null,
  limitResetDate: null,
};

// Async thunk to fetch expenses
export const fetchExpenses = createAsyncThunk<Expense[], void, { rejectValue: string }>(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8880/api/v1/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a new expense
export const addExpenseAsync = createAsyncThunk<Expense, Omit<Expense, '_id'>, { rejectValue: string; dispatch: AppDispatch }>(
  'expenses/addExpense',
  async (expense, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('http://localhost:8880/api/v1/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      const data = await response.json();

      // Refresh expenses list after adding a new expense
      dispatch(fetchExpenses());
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update an expense
export const updateExpenseAsync = createAsyncThunk<
  Expense,
  { id: string; updates: Omit<Expense, '_id'> },
  { rejectValue: string; dispatch: AppDispatch }
>(
  'expenses/updateExpense',
  async ({ id, updates }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:8880/api/v1/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
      const data = await response.json();

      // Refresh expenses list after updating an expense
      dispatch(fetchExpenses());
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete an expense
export const deleteExpenseAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>(
  'expenses/deleteExpense',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:8880/api/v1/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Refresh expenses list after deleting the expense
      dispatch(fetchExpenses());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Reducer to set limits
    setLimits: (state, action: PayloadAction<Record<string, number>>) => {
      state.limits = { ...defaultLimits, ...action.payload };
      state.limitResetDate = new Date().toISOString();
      saveLimitsToLocalStorage(state.limits, state.limitResetDate);
    },
    // Reducer to reset limits after a month
    resetLimitsIfExpired: (state) => {
      if (isMonthElapsed(state.limitResetDate)) {
        state.limits = { ...defaultLimits };
        state.limitResetDate = new Date().toISOString();
        saveLimitsToLocalStorage(state.limits, state.limitResetDate);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch expenses';
      })
      .addCase(addExpenseAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add expense';
      })
      .addCase(updateExpenseAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateExpenseAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update expense';
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete expense';
      });
  },
});

// Export actions and reducer
export const { setLimits, resetLimitsIfExpired } = expenseSlice.actions;
export default expenseSlice.reducer;
