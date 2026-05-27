import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChatbotMessage,
  deleteChatbotMessage,
  getChatbotMessages,
  updateChatbotMessage,
} from "../api/chatbotApi";

export const useChatbotMessages = (filters = {}) => {
  return useQuery({
    queryKey: ["chatbot-messages", filters],
    queryFn: () => getChatbotMessages(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateChatbotMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatbotMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-messages"] });
    },
  });
};

export const useUpdateChatbotMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChatbotMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-messages"] });
    },
  });
};

export const useDeleteChatbotMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChatbotMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-messages"] });
    },
  });
};
