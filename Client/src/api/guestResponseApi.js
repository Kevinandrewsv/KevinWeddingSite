import axiosInstance from "./axiosInstance";

export const createGuestResponse = async (guestResponseData) => {
  const response = await axiosInstance.post(
    "/guest-responses",
    guestResponseData
  );
  return response.data;
};

export const getGuestResponses = async () => {
  const response = await axiosInstance.get("/guest-responses");
  return response.data;
};

export const getGuestResponseById = async (id) => {
  const response = await axiosInstance.get(`/guest-responses/${id}`);
  return response.data;
};

export const updateGuestResponse = async ({ id, guestResponseData }) => {
  const response = await axiosInstance.put(
    `/guest-responses/${id}`,
    guestResponseData
  );
  return response.data;
};

export const deleteGuestResponse = async (id) => {
  const response = await axiosInstance.delete(`/guest-responses/${id}`);
  return response.data;
};