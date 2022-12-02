import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NoteOutput } from "../../dtos/notes";

interface NotesSliceState {
  current: NoteOutput | null;
  list: NoteOutput[];
}

const initialState: NotesSliceState = {
  current: null,
  list: [],
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (id: number) => {
    return (await window.Bridge?.getNotes(id)) ?? [];
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<NoteOutput>) => {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { setCurrent } = notesSlice.actions;

export default notesSlice.reducer;
