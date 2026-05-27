import axiosInstance from "./axiosInstance";

export const getGalleryItems = async (filters = {}) => {
  const response = await axiosInstance.get("/gallery", {
    params: filters,
  });

  return response.data;
};

export const getAllGalleryItemsForAdmin = async (filters = {}) => {
  const response = await axiosInstance.get("/gallery/admin/all", {
    params: filters,
  });

  return response.data;
};

export const getGalleryItemById = async (id) => {
  const response = await axiosInstance.get(`/gallery/${id}`);
  return response.data;
};

export const createGalleryItem = async (galleryData) => {
  const response = await axiosInstance.post("/gallery", galleryData);
  return response.data;
};

export const updateGalleryItem = async ({ id, galleryData }) => {
  const response = await axiosInstance.put(`/gallery/${id}`, galleryData);
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await axiosInstance.delete(`/gallery/${id}`);
  return response.data;
};