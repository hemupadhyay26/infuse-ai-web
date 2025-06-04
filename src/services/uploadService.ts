import API from "@/lib/axios";

export const uploadService = {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  }
};