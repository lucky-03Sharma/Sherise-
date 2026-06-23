export default function getApiErrorMessage(err, fallback) {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.response?.data?.error) {
    return err.response.data.error;
  }

  if (err.code === "ERR_NETWORK" || !err.response) {
    return "Cannot reach the server. Make sure the backend is running on port 5000.";
  }

  return fallback;
}
