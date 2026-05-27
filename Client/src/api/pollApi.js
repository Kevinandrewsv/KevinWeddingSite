import axiosInstance from "./axiosInstance";

export const getPublicPolls = async (visitorId) => {
  const response = await axiosInstance.get("/polls/public", {
    params: visitorId ? { visitorId } : {},
  });
  return response.data;
};

export const votePoll = async ({ pollId, visitorId, selectedOption }) => {
  const response = await axiosInstance.post(`/polls/${pollId}/vote`, {
    visitorId,
    selectedOption,
  });
  return response.data;
};

export const suggestPoll = async (pollData) => {
  const response = await axiosInstance.post("/polls/suggest", pollData);
  return response.data;
};

export const getAdminPolls = async (filters = {}) => {
  const response = await axiosInstance.get("/polls/admin/all", {
    params: filters,
  });
  return response.data;
};

export const createAdminPoll = async (pollData) => {
  const response = await axiosInstance.post("/polls/admin", pollData);
  return response.data;
};

export const updatePoll = async ({ id, updates }) => {
  const response = await axiosInstance.patch(`/polls/admin/${id}`, updates);
  return response.data;
};

export const deletePoll = async (id) => {
  const response = await axiosInstance.delete(`/polls/admin/${id}`);
  return response.data;
};

export const resetPollVotes = async (id) => {
  const response = await axiosInstance.patch(`/polls/admin/${id}/reset-votes`);
  return response.data;
};
