import axios from "axios";

const FALLBACK_API_URL = "http://localhost:8000/api/";

function normalizeApiUrl(url) {
  const value = url || FALLBACK_API_URL;
  return value.endsWith("/") ? value : `${value}/`;
}

export const API_BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
export const API_SITE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

let getAccessToken = () => null;
let refreshAccessToken = async () => null;
let handleSessionExpired = () => {};

export function configureApiClient({
  getToken,
  refreshToken,
  onSessionExpired,
}) {
  if (typeof getToken === "function") {
    getAccessToken = getToken;
  }

  if (typeof refreshToken === "function") {
    refreshAccessToken = refreshToken;
  }

  if (typeof onSessionExpired === "function") {
    handleSessionExpired = onSessionExpired;
  }
}

export function resolveAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_SITE_URL}${path}`;
  }

  return `${API_SITE_URL}/${path}`;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let refreshPromise = null;

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    if (
      status !== 401 ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh
    ) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      refreshPromise =
        refreshPromise ||
        Promise.resolve(refreshAccessToken()).finally(() => {
          refreshPromise = null;
        });

      const nextToken = await refreshPromise;

      if (!nextToken) {
        handleSessionExpired();
        throw error;
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      handleSessionExpired();
      throw refreshError;
    }
  },
);

export default apiClient;
