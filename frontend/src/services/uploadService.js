import api from "./http";

export const uploadService = {
  uploadImage: (formData) =>
    api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
};
