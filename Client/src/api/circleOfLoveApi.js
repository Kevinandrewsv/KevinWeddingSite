import axiosInstance from "./axiosInstance";

export const createCircleStory = async (storyData) => {
  const response = await axiosInstance.post("/circle-of-love", storyData);
  return response.data;
};

export const getApprovedCircleStories = async () => {
  const response = await axiosInstance.get("/circle-of-love");
  return response.data;
};

export const getAdminCircleStories = async (filters = {}) => {
  const response = await axiosInstance.get("/circle-of-love/admin/all", {
    params: filters,
  });
  return response.data;
};

export const approveCircleStory = async (id) => {
  const response = await axiosInstance.patch(`/circle-of-love/admin/${id}/approve`);
  return response.data;
};

export const rejectCircleStory = async (id) => {
  const response = await axiosInstance.patch(`/circle-of-love/admin/${id}/reject`);
  return response.data;
};

export const toggleFeaturedCircleStory = async (id) => {
  const response = await axiosInstance.patch(`/circle-of-love/admin/${id}/featured`);
  return response.data;
};

export const deleteCircleStory = async (id) => {
  const response = await axiosInstance.delete(`/circle-of-love/admin/${id}`);
  return response.data;
};
