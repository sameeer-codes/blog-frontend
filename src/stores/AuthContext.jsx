import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { configureApiClient } from "../lib/api-client";
import { getApiErrorMessage } from "../lib/api-helpers";
import {
  loginUser,
  logoutUser,
  refreshSessionToken,
} from "../services/auth";

const TOKEN_STORAGE_KEY = "authToken";

function persistToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    return storedToken || null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState("");

  const clearSession = useCallback(() => {
    setAuthToken(null);
    setIsLoggedIn(false);
    persistToken(null);
  }, []);

  const applySession = useCallback((nextToken) => {
    setAuthToken(nextToken);
    setIsLoggedIn(Boolean(nextToken));
    persistToken(nextToken);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const nextToken = await refreshSessionToken();

      if (!nextToken) {
        clearSession();
        return null;
      }

      applySession(nextToken);
      setAuthError("");

      return nextToken;
    } catch {
      clearSession();
      return null;
    }
  }, [applySession, clearSession]);

  const login = useCallback(async (credentials) => {
    const payload = await loginUser(credentials);
    const nextToken = payload?.data?.jwt;

    if (!nextToken) {
      throw new Error("The login response did not include a JWT.");
    }

    applySession(nextToken);
    setAuthError("");

    return payload;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      if (authToken) {
        await logoutUser();
      }
    } catch (error) {
      setAuthError(
        getApiErrorMessage(error, "The session ended locally, but logout failed."),
      );
    } finally {
      clearSession();
    }
  }, [authToken, clearSession]);

  useEffect(() => {
    configureApiClient({
      getToken: () => authToken,
      refreshToken: refreshSession,
      onSessionExpired: clearSession,
    });
  }, [authToken, clearSession, refreshSession]);

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    async function bootstrapSession() {
      try {
        await refreshSession();
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      token: [authToken, setAuthToken],
      loggedIn: [isLoggedIn, setIsLoggedIn],
      isReady,
      authError,
      authActions: {
        login,
        logout,
        refreshSession,
        clearSession,
      },
    }),
    [
      authError,
      authToken,
      clearSession,
      isLoggedIn,
      isReady,
      login,
      logout,
      refreshSession,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
