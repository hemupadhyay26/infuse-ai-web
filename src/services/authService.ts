import API from "@/lib/axios";

export const authService = {
  async signup(username: string, password: string , email: string) {
    const res = await API.post("/signup", { username, password, email });
    return res.data.user;
  },

  async login(username: string, password: string) {
    const res = await API.post("/login", { username, password });
    return res.data.user;
  },

  async logout() {
    await API.post("/logout");
  },

  async getCurrentUser() {
    try {
      const res = await API.get("/auth/user");
      return res.data.user;
    } catch (error) {
      return null;
    }
  },
  
  isAuthenticated() {
    // Check if auth token exists in cookies
    return document.cookie.includes('auth=') || document.cookie.includes('token=');
  }
};
