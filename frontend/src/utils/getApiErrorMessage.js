export default function getApiErrorMessage(err, fallback = "An unexpected error occurred. Please try again.") {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.response?.data?.error) {
    return err.response.data.error;
  }

  if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
    return "Server response timed out. The server may be waking up, please try again in a few seconds.";
  }

  if (err?.code === "ERR_NETWORK" || !err?.response) {
    return "Unable to connect to the server. Please check your internet connection or verify the backend service is running.";
  }

  return fallback;
}
