import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user");
const initialState = userFromStorage ? JSON.parse(userFromStorage) : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...action.payload }; 
    },
    clearUserData: () => {
      return null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;