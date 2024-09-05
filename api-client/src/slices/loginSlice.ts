import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

export type loginState = {
  loggedIn: boolean;
  error: boolean;
};

const loginStateSlice = createSlice({
  name: 'loginState',
  initialState: { loggedIn: false, error: false },
  reducers: {
    setLogIn: (state) => {
      state.loggedIn = true;
    },
    setLogOut: (state) => {
      state.loggedIn = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const selectLoginState = (state: RootState) => state.loginState.loggedIn;
export const selectLoginError = (state: RootState) => state.loginState.error;
export const { setLogIn, setLogOut, setError } = loginStateSlice.actions;

export default loginStateSlice.reducer;
