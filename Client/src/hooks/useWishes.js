import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWish,
  deleteWish,
  getAllWishesForAdmin,
  getWishes,
  updateWish,
} from "../api/wishApi";

export const useWishes = () => {
  return useQuery({
    queryKey: ["wishes"],
    queryFn: getWishes,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useAdminWishes = () => {
  return useQuery({
    queryKey: ["admin-wishes"],
    queryFn: getAllWishesForAdmin,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      queryClient.invalidateQueries({ queryKey: ["featured-wishes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-wishes"] });
    },
  });
};

export const useUpdateWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      queryClient.invalidateQueries({ queryKey: ["featured-wishes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-wishes"] });
    },
  });
};

export const useDeleteWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      queryClient.invalidateQueries({ queryKey: ["featured-wishes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-wishes"] });
    },
  });
};