import { configureStore } from "@reduxjs/toolkit";
import notebooksReducer from "./reducers/notebooksSlice";
import notesReducer from './reducers/notesSlice'

export const store = configureStore({
  reducer: {
    notebooks: notebooksReducer,
    notes: notesReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
