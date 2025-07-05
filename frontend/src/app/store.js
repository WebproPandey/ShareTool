// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./features/file/fileSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer,
  },
});
