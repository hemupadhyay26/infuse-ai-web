import API from "@/lib/axios";

export const authService = {
  async signup(username: string, password: string , email: string) {
    const res = await API.post("/api/signup", { username, password, email });
    return res.data.user;
  },

  async login(username: string, password: string) {
    const res = await API.post("/api/login", { username, password });
    return res.data.user;
  },

  async logout() {
    await API.post("/api/logout");
  },

  async getCurrentUser() {
    const res = await API.get("/api/auth/user");
    return res.data.user;
  }
};
