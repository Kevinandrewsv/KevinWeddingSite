import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGuestResponse,
  deleteGuestResponse,
  getGuestResponses,
  updateGuestResponse,
} from "../api/guestResponseApi";

export const useGuestResponses = () => {
  return useQuery({
    queryKey: ["guest-responses"],
    queryFn: getGuestResponses,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateGuestResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuestResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-responses"] });
    },
  });
};

export const useUpdateGuestResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGuestResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-responses"] });
    },
  });
};

export const useDeleteGuestResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGuestResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-responses"] });
    },
  });
};