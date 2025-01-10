import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice'; // Adjust the path to your reducer

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
