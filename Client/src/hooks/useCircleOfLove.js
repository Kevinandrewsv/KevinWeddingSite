import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveCircleStory,
  createCircleStory,
  deleteCircleStory,
  getAdminCircleStories,
  getApprovedCircleStories,
  rejectCircleStory,
  toggleFeaturedCircleStory,
} from "../api/circleOfLoveApi";

export const useApprovedCircleStories = () => {
  return useQuery({
    queryKey: ["circle-of-love", "approved"],
    queryFn: getApprovedCircleStories,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAdminCircleStories = (filters = {}) => {
  return useQuery({
    queryKey: ["circle-of-love", "admin", filters],
    queryFn: () => getAdminCircleStories(filters),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateCircleStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCircleStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-of-love"] });
    },
  });
};

export const useApproveCircleStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCircleStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-of-love"] });
    },
  });
};

export const useRejectCircleStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectCircleStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-of-love"] });
    },
  });
};

export const useToggleFeaturedCircleStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFeaturedCircleStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-of-love"] });
    },
  });
};

export const useDeleteCircleStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCircleStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-of-love"] });
    },
  });
};
