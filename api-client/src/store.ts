import { configureStore } from '@reduxjs/toolkit';
import loginStateReducer, { loginState } from './slices/loginSlice';

export type RootState = {
  loginState: loginState;
};

const store = configureStore({
  reducer: {
    loginState: loginStateReducer,
  },
});

export default store;
