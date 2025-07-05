import api from "../../../api/api.js";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
