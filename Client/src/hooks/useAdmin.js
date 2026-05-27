import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdminProfile, loginAdmin } from "../api/adminApi";
import useAuthStore from "../store/authStore";

export const useLoginAdmin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (response) => {
      login(response.data);
    },
  });
};

export const useAdminProfile = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};