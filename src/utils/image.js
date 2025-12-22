const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getImageUrl = (path) => {
  if (!path) return null;

  // Already full URL
  if (path.startsWith("http")) return path;

  // Laravel public storage
  return `${BASE_URL}/storage/${path}`;
};
