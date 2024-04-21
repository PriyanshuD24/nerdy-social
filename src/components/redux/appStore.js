import "@reduxjs/toolkit";
import userInfoReducer from "./UserSlice";
import { configureStore } from "@reduxjs/toolkit";
const appStore = configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
});
export default appStore;