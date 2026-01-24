import { useContext, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../stores/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function useApi() {
  const {
    token: [authToken, setAuthToken],
    loggedIn: [isLoggedIn, setIsLoggedIn],
  } = useContext(AuthContext); // FIXED
  const refreshPromise = useRef(null);

  // create axios instance only once
  const api = useMemo(() => {
    return axios.create({
      baseURL: apiUrl,
      withCredentials: true,
    });
  }, []);

  /** Refresh token request */
  const refreshToken = async () => {
    const res = await axios.get(`${apiUrl}/refresh-token`, {
      withCredentials: true,
    });
    return res.data?.token;
  };

  /** ---------------- REQUEST INTERCEPTOR ---------------- */
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(reqInterceptor);
    };
  }, [authToken, api]);

  /** ---------------- RESPONSE INTERCEPTOR ---------------- */
  useEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (error?.response?.status === 453 && !original._retry) {
          original._retry = true;

          if (!refreshPromise.current) {
            refreshPromise.current = refreshToken();
          }

          try {
            const newToken = await refreshPromise.current;
            refreshPromise.current = null;

            setAuthToken(newToken);
            original.headers.Authorization = `Bearer ${newToken}`;

            return api(original);
          } catch (err) {
            refreshPromise.current = null;
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(resInterceptor);
    };
  }, [api, setAuthToken]);

  return api;
}
