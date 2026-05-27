import axiosInstance from "./axiosInstance";

export const createChatbotMessage = async (messageData) => {
  const response = await axiosInstance.post("/chatbot/messages", messageData);
  return response.data;
};

export const getChatbotMessages = async (filters = {}) => {
  const response = await axiosInstance.get("/chatbot/messages", {
    params: filters,
  });
  return response.data;
};

export const updateChatbotMessage = async ({ id, messageData }) => {
  const response = await axiosInstance.patch(
    `/chatbot/messages/${id}`,
    messageData
  );
  return response.data;
};

export const deleteChatbotMessage = async (id) => {
  const response = await axiosInstance.delete(`/chatbot/messages/${id}`);
  return response.data;
};
