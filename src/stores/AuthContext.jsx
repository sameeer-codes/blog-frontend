import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const localLogin = JSON.parse(localStorage.getItem("isLoggedIn") || "false");
    const storedToken = localStorage.getItem("authToken");

    setIsLoggedIn(Boolean(localLogin));
    setAuthToken(storedToken || null);
    setIsReady(true);
  }, []);

  function login(nextToken = "demo-auth-token") {
    setAuthToken(nextToken);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("authToken", nextToken);
  }

  function logout() {
    setAuthToken(null);
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
    localStorage.removeItem("authToken");
  }

  const value = useMemo(
    () => ({
      token: [authToken, setAuthToken],
      loggedIn: [isLoggedIn, setIsLoggedIn],
      isReady,
      authActions: {
        login,
        logout,
      },
    }),
    [authToken, isLoggedIn, isReady],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
