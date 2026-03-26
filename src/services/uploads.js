import apiClient from "../lib/api-client";

export async function getUploads({ page = 1, limit = 24 } = {}) {
  const response = await apiClient.get("uploads", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function uploadFiles(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  const response = await apiClient.post("uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateUpload(payload) {
  const response = await apiClient.patch("uploads", payload);
  return response.data;
}

export async function deleteUploadById(id) {
  const response = await apiClient.delete("uploads", {
    data: {
      id,
    },
  });

  return response.data;
}
