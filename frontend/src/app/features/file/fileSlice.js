// src/features/file/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFile } from "./fileService";

const initialState = {
  uploaded: null,
  loading: false,
  error: null,
};

export const sendFile = createAsyncThunk("file/sendFile", async (file, thunkAPI) => {
  try {
    return await uploadFile(file);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploaded = action.payload;
      })
      .addCase(sendFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fileSlice.reducer;
