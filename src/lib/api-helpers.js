import axios from "axios";

export function getApiMessage(payload, fallback = "Request completed.") {
  return payload?.message || fallback;
}

export function getApiData(payload, fallback = null) {
  return payload?.data ?? fallback;
}

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;

    if (responseMessage) {
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
