import instance from "../config/AxiosConfig";
import type { AuthFormData } from "../components/auth/AuthModal";

export const login = async (email: string, password: string) => {
  const res = await instance.post("/users/login", { email, password });
  return res.data;
};

export const register = async (formData: AuthFormData) => {
  const res = await instance.post("/users", formData);
  return res.data;
};

export const logout = async (setUser: (user: null) => void) => {
  await instance.post("/users/logout");
  setUser(null);
};