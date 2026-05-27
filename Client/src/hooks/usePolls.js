import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminPoll,
  deletePoll,
  getAdminPolls,
  getPublicPolls,
  resetPollVotes,
  suggestPoll,
  updatePoll,
  votePoll,
} from "../api/pollApi";

export const usePublicPolls = (visitorId) => {
  return useQuery({
    queryKey: ["polls", "public", visitorId],
    queryFn: () => getPublicPolls(visitorId),
    enabled: Boolean(visitorId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useVotePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useSuggestPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suggestPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useAdminPolls = (filters = {}) => {
  return useQuery({
    queryKey: ["polls", "admin", filters],
    queryFn: () => getAdminPolls(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateAdminPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useUpdatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useDeletePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useResetPollVotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPollVotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};
