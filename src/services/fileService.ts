import API from "@/lib/axios";

export const fileService = {
  async listFiles() {
    const res = await API.get("/files");
    return res.data.files;
  },
  async getFile(fileId: string) {
    const res = await API.get(`/files/${fileId}`);
    return res.data.file;
  },
  async deleteFile(fileId: string) {
    await API.delete(`/files/${fileId}`);
  }
};