import API from "@/lib/axios";

export const askService = {
  async ask(question: string, fileId?: string) {
    const res = await API.post("/ask", { question, fileId });
    return res.data;
  },
  async askStream(question: string, fileId?: string) {
    // For streaming, you may need to use fetch or a custom axios config
    const res = await API.post("/ask/stream", { question, fileId }, {
      responseType: "stream"
    });
    return res.data;
  }
};