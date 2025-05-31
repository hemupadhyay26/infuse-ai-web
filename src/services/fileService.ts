import API from "@/lib/axios";

export const fileService = {
  async listFiles() {
    const res = await API.get("/api/files");
    return res.data.files;
  },
  async getFile(fileId: string) {
    const res = await API.get(`/api/files/${fileId}`);
    return res.data.file;
  },
  async deleteFile(fileId: string) {
    await API.delete(`/api/files/${fileId}`);
  }
};