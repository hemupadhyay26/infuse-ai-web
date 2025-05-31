import API from "@/lib/axios";

export const chatHistoryService = {
  async getAll() {
    const res = await API.get("/api/chat-history");
    // console.log("Chat history response:", JSON.stringify(res.data.history, null, 2));
    return res.data.history;
  },
  async getMessage(messageId: string) {
    const res = await API.get(`/api/chat-history/${messageId}`);
    return res.data.message;
  },
  async deleteMessage(messageId: string) {
    const res = await API.delete(`/api/chat-history/${messageId}`);
    return res.data;
  },
  async deleteAll() {
    const res = await API.delete("/api/chat-history");
    return res.data;
  }
};