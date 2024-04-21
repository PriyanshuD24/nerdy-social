import { createSlice } from "@reduxjs/toolkit";
const UserSlice = createSlice({
  name: "userInfo",

  initialState: {
    user: null,
    userData: null,
    userSignUp: [null, null],
    userPostsUrl: [],
  },

  reducers: {
    updateUser: (state, action) => {
      console.log("UPDATEUSER");

      state.user = action.payload;
    },
    updateUserData: (state, action) => {
      console.log("UPDATEUSER");

      state.userData = action.payload;
    },
    updateUserSignUp: (state, action) => {
      state.userSignUp = action.payload;
    },
    updateUserPosts: (state, action) => {
      if (action.payload == false) {
        state.userPostsUrl.length = 0;
        return;
      } else state.userPostsUrl = action.payload;
      if (state.userPostsUrl.length >= 2) {
        state?.userPostsUrl?.sort((a, b) => b?.createdAt - a?.createdAt);
      }
    },

    logout: (state, action) => {
      state.user = null;
      state.userData = null;
      state.userSignUp = [null, null];
      state.userPostsUrl.length = 0;
    },
  },
});

export default UserSlice.reducer;

export const {
  updateUser,
  updateUserData,
  updateUserSignUp,
  logout,
  updateUserPosts,

  clearPosts,
} = UserSlice.actions;
