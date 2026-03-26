import apiClient from "../lib/api-client";
import { getApiData } from "../lib/api-helpers";

export async function registerUser(payload) {
  const response = await apiClient.post("auth/register", payload, {
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function loginUser(payload) {
  const response = await apiClient.post("auth/login", payload, {
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function refreshSessionToken() {
  const response = await apiClient.post(
    "refresh-token",
    {},
    {
      skipAuthRefresh: true,
    },
  );

  const data = getApiData(response.data, {});
  return data.token || null;
}

export async function logoutUser() {
  const response = await apiClient.post(
    "auth/logout",
    {},
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
}
