import { useCallback, useEffect, useState } from "react";
import { getApiData, getApiErrorMessage } from "../lib/api-helpers";
import { getUploads } from "../services/uploads";

export default function useUploadsLibrary({
  page = 1,
  limit = 50,
  enabled = true,
} = {}) {
  const [uploads, setUploads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");

  const loadUploads = useCallback(async () => {
    if (!enabled) {
      return [];
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = await getUploads({ page, limit });
      const data = getApiData(payload, {});

      setUploads(data.items || []);
      setPagination(data.pagination || null);

      return data.items || [];
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to load uploads right now. Please try again.",
        ),
      );
      setUploads([]);
      setPagination(null);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [enabled, limit, page]);

  useEffect(() => {
    if (!enabled) {
      setUploads([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    loadUploads();
  }, [enabled, loadUploads]);

  return {
    uploads,
    pagination,
    isLoading,
    error,
    reload: loadUploads,
  };
}
