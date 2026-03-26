import apiClient from "../lib/api-client";

export async function getPublicPosts({ page = 1, limit = 9 } = {}) {
  const response = await apiClient.get("posts", {
    params: {
      page,
      limit,
    },
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function searchPublicPosts({
  query,
  page = 1,
  limit = 9,
}) {
  const response = await apiClient.get("posts/search", {
    params: {
      query,
      page,
      limit,
    },
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function getPublicPostBySlug(slug) {
  const response = await apiClient.get("posts/slug", {
    params: {
      slug,
    },
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function getMyPosts({ page = 1, limit = 12 } = {}) {
  const response = await apiClient.get("posts/me", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function getMyPostById(id) {
  const response = await apiClient.get("posts/me/single", {
    params: {
      id,
    },
  });

  return response.data;
}

export async function createPost(payload) {
  const response = await apiClient.post("posts", payload);
  return response.data;
}

export async function updatePost(payload) {
  const response = await apiClient.patch("posts", payload);
  return response.data;
}

export async function deletePost(postId) {
  const response = await apiClient.delete("posts", {
    data: {
      post_id: postId,
    },
  });

  return response.data;
}
