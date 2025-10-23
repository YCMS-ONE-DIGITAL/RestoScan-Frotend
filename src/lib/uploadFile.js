import axios from "axios";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:5000/api/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // returns { success: true, url: '...' }
}

