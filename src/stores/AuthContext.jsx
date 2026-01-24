import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const localLogin = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (localLogin) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        token: [authToken, setAuthToken],
        loggedIn: [isLoggedIn, setIsLoggedIn],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
