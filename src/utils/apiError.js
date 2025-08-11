export function extractApiErrorMessage(err, fallback = "Something went wrong.") {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}