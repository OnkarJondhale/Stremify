import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (_, action) => action.payload,
    clearAuthData: () => null,
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
