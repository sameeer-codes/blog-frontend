import apiClient from "../lib/api-client";

export async function getAdminUsers({
  status = "all",
  page = 1,
  limit = 20,
} = {}) {
  const response = await apiClient.get("admin/users", {
    params: {
      status,
      page,
      limit,
    },
  });

  return response.data;
}

export async function updateAdminUserStatus({ id, status }) {
  const response = await apiClient.patch("admin/users/status", {
    id,
    status,
  });

  return response.data;
}

export async function getAdminUserById(id) {
  const response = await apiClient.get("admin/users/single", {
    params: {
      id,
    },
  });

  return response.data;
}

export async function updateAdminUserRole({ id, user_role }) {
  const response = await apiClient.patch("admin/users/role", {
    id,
    user_role,
  });

  return response.data;
}

export async function getAdminPosts({
  status = "all",
  page = 1,
  limit = 20,
} = {}) {
  const response = await apiClient.get("admin/posts", {
    params: {
      status,
      page,
      limit,
    },
  });

  return response.data;
}

export async function updateAdminPostStatus({ post_id, post_status }) {
  const response = await apiClient.patch("admin/posts/status", {
    post_id,
    post_status,
  });

  return response.data;
}

export async function updateAdminPost(payload) {
  const response = await apiClient.patch("admin/posts", payload);

  return response.data;
}

export async function deleteAdminPost(postId) {
  const response = await apiClient.delete("admin/posts", {
    data: {
      post_id: postId,
    },
  });

  return response.data;
}

export async function getAdminUploads({ page = 1, limit = 20 } = {}) {
  const response = await apiClient.get("admin/uploads", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function deleteAdminUpload(id) {
  const response = await apiClient.delete("admin/uploads", {
    data: {
      id,
    },
  });

  return response.data;
}

export async function updateAdminUpload(payload) {
  const response = await apiClient.patch("admin/uploads", payload);

  return response.data;
}
