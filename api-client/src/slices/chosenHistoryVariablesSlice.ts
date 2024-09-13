import { KeyValuePair } from '@/Components/KeyValueEditor/KeyValueEditor';
import { RootState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChosenHistoryVariablesState = {
  variables: KeyValuePair[];
};

const initialState: ChosenHistoryVariablesState = {
  variables: [],
};

const chosenHistoryVariablesSlice = createSlice({
  name: 'chosenHistoryVariables',
  initialState,
  reducers: {
    setChosenHistoryVariables: (
      state,
      action: PayloadAction<KeyValuePair[]>
    ) => {
      state.variables = action.payload;
    },
    clearChosenHistoryVariables: (state) => {
      state.variables = [];
    },
  },
});

export const selectChosenHistoryVariables = (state: RootState) =>
  state.chosenHistoryVariables.variables;

export const { setChosenHistoryVariables, clearChosenHistoryVariables } =
  chosenHistoryVariablesSlice.actions;

export default chosenHistoryVariablesSlice.reducer;
