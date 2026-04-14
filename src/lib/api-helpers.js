import axios from "axios";

export function getApiMessage(payload, fallback = "Request completed.") {
  return payload?.message || fallback;
}

export function getApiData(payload, fallback = null) {
  if (payload?.success === false) {
    return fallback;
  }

  return payload?.data ?? fallback;
}

export function getApiFieldErrors(source) {
  const payload = axios.isAxiosError(source) ? source.response?.data : source;
  const data = payload?.data;

  if (!data || Array.isArray(data) || typeof data !== "object") {
    return [];
  }

  return Object.entries(data).flatMap(([field, value]) => {
    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .map((item) => `${field}: ${String(item)}`);
    }

    if (value && typeof value === "object") {
      return Object.values(value)
        .filter(Boolean)
        .map((item) => `${field}: ${String(item)}`);
    }

    if (typeof value === "string" && value.trim()) {
      return [`${field}: ${value}`];
    }

    return [];
  });
}

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    const fieldErrors = getApiFieldErrors(error);

    if (responseMessage) {
      if (fieldErrors.length > 0) {
        return `${responseMessage} ${fieldErrors.slice(0, 2).join(" ")}`.trim();
      }

      return responseMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function formatApiDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
