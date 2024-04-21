import React, { createContext, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { FSContext, FSProvider } from "./firebase/firebase";
import "@reduxjs/toolkit";
import { Provider } from "react-redux";
import appStore from "./components/redux/appStore";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateUserData } from "./components/redux/UserSlice";
import Profile from "./components/Profile";
import Home from "./components/Home";

const App = () => {
  // const userData= useSelector((store)=> store.userInfo.userData);
  const user = useSelector((store) => store.userInfo.user);
  console.log("APP", user);

  const appRoutes = createBrowserRouter([
    {
      path: "/auth",
      element: <Login />,
    },

    {
      path: "/",
      element: user != null ? <Body /> : <Navigate to="/auth" />,
      children: [
        {
          path: "/:userId",
          element: user != null ? <Profile /> : <Navigate to="/auth" />,
        },
        {
          path: "/home",
          element: user != null ? <Home /> : <Navigate to="/auth" />,
        },
      ],
      // errorElement: <Login />,
      // element: <Body />,
    },
  ]);
  console.log("Below ;)");
  return <RouterProvider router={appRoutes} />;
};

const root = ReactDOM.createRoot(document.querySelector(".root"));
root.render(
  // <UserContext.Provider value={{userId, setUserId}}>
  <FSProvider>
    <Provider store={appStore}>
      <App />
    </Provider>
  </FSProvider>
  // </UserContext.Provider>
);
