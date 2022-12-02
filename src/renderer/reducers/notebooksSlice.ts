import {
  Action,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { NotebookOutput } from "../../dtos/notebooks";

export interface NotebooksSliceState {
  current: NotebookOutput | null;
  list: NotebookOutput[];
}

const initialState: NotebooksSliceState = {
  current: null,
  list: [],
};

export const fetchNotebooks = createAsyncThunk(
  "notebooks/fetchNotebooks",
  async () => {
    return ((await window.Bridge?.getNotebooks()) ?? []) as NotebookOutput[];
  }
);

export const notebooksSlice = createSlice({
  name: "notebook",
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<NotebookOutput>) => {
      state.current = action.payload;
    },
    setNotebooks: (state, action: PayloadAction<NotebookOutput[]>) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotebooks.fulfilled, (state, action) => {
      if (action.payload) {
        state.list = action.payload;
      }
    });
  },
});

export const { setCurrent, setNotebooks } = notebooksSlice.actions;

export default notebooksSlice.reducer;
