import axiosInstance from "./axiosInstance";

export const getWishes = async () => {
  const response = await axiosInstance.get("/wishes");
  return response.data;
};

export const getAllWishesForAdmin = async () => {
  const response = await axiosInstance.get("/wishes/admin/all");
  return response.data;
};

export const createWish = async (wishData) => {
  const response = await axiosInstance.post("/wishes", wishData);
  return response.data;
};

export const updateWish = async ({ id, wishData }) => {
  const response = await axiosInstance.put(`/wishes/${id}`, wishData);
  return response.data;
};

export const deleteWish = async (id) => {
  const response = await axiosInstance.delete(`/wishes/${id}`);
  return response.data;
};