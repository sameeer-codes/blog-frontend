import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../stores/AuthContext";

const GuestRoute = () => {
  const {
    loggedIn: [isLoggedIn],
  } = useContext(AuthContext);

  return <>{!isLoggedIn ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default GuestRoute;
