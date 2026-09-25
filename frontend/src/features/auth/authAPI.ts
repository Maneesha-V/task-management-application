import axiosInstance from "../../api/axiosInstance";
import type { LoginResp, User } from "../../types/userTypes";

export const registerAPI = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const res = await axiosInstance.post<{ user: User }>("/auth/register", data);
  return res.data.user;
};

export const loginAPI = async (data: {
  email: string;
  password: string;
}): Promise<LoginResp> => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

export const refreshTokenApi = async () => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};