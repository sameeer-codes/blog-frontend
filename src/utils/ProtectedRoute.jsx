import React, { useContext } from "react";
import { AuthContext } from "../stores/AuthContext";
import { Navigate, Outlet } from "react-router";
import useApi from "../hooks/useApi";

const ProtectedRoute = () => {
  const {
    loggedIn: [isLoggedIn, setIsLoggedIn],
    token: [authToken, setAuthToken],
  } = useContext(AuthContext);

  const api = useApi();

  async function getJwt() {
    try {
      const response = await api.post("/refresh-token");
      setAuthToken(response.data.data.token);
    } catch (e) {
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      setIsLoggedIn(false);
    }
  }

  if (isLoggedIn) {
    if (authToken === null || !authToken) {
      getJwt();
    }
  }

  return <>{isLoggedIn ? <Outlet /> : <Navigate to={"/auth/login"} />}</>;
};

export default ProtectedRoute;
