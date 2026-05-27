import axiosInstance from "./axiosInstance";

export const loginAdmin = async (loginData) => {
  const response = await axiosInstance.post("/admin/login", loginData);
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await axiosInstance.get("/admin/profile");
  return response.data;
};