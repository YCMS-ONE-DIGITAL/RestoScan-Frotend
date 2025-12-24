
const BASE_URL = import.meta.env.VITE_API_URL;



export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const base =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000";

  return `${base}/${path}`;
};
