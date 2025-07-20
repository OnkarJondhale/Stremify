import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userReducer from "./slices/user.slice";
import themeReducer from "./slices/theme.slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer 
  },
});

export default store;
