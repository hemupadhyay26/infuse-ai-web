import API from "@/lib/axios";

export const chatHistoryService = {
  async getAll() {
    const res = await API.get("/chat-history");
    return res.data.history;
  },
  async getMessage(messageId: string) {
    const res = await API.get(`/chat-history/${messageId}`);
    return res.data.message;
  },
  async deleteMessage(messageId: string) {
    const res = await API.delete(`/chat-history/${messageId}`);
    return res.data;
  },
  async deleteAll() {
    const res = await API.delete("/chat-history");
    return res.data;
  }
};