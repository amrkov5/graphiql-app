import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

export type loginState = {
  loggedIn: boolean;
};

const loginStateSlice = createSlice({
  name: 'loginState',
  initialState: { loggedIn: false },
  reducers: {
    setLogIn: (state) => {
      state.loggedIn = true;
    },
    setLogOut: (state) => {
      state.loggedIn = false;
    },
  },
});

export const selectLoginState = (state: RootState) => state.loginState.loggedIn;
export const { setLogIn, setLogOut } = loginStateSlice.actions;

export default loginStateSlice.reducer;
