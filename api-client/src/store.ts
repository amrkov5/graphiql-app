import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer from './slices/loginSlice';
import chosenHistoryVariablesReducer from './slices/chosenHistoryVariablesSlice';

const store = configureStore({
  reducer: {
    loginState: loginStateReducer,
    chosenHistoryVariables: chosenHistoryVariablesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
