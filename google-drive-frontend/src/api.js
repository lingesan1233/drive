// wrapper for calls to your backend and helper to build public URLs
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";

export const api = axios.create({
  baseURL: API_URL,
});

export const signup = (email, password) => api.post("/signup", { email, password });
export const login = (email, password) => api.post("/login", { email, password });

export const uploadFile = (file) => {
  const fd = new FormData();
  // file.name can include a folder prefix like "folder/filename.ext"
  fd.append("file", file, file.name);
  return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
};

export const listFiles = () => api.get("/files");
export const deleteFile = (fileName) => api.delete(`/files/${encodeURIComponent(fileName)}`);

// build the public URL for preview/download (public bucket)
export const publicFileUrl = (fileName) => {
  if (!SUPABASE_URL) return null;
  // bucket is `my-bucket` and path is `uploads/...`
  return `${SUPABASE_URL}/storage/v1/object/public/my-bucket/uploads/${encodeURIComponent(
    fileName
  )}`;
};
