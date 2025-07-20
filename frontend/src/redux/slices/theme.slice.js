import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("theme") || 'forest';

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme : (state,action) => {
        return action.payload
    }
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
