import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export const useFeaturedWishes = () => {
  return useQuery({
    queryKey: ["featured-wishes"],
    queryFn: async () => {
      const response = await api.get("/wishes/featured");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};