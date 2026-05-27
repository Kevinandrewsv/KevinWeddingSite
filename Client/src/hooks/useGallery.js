import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createGalleryItem,
  deleteGalleryItem,
  getAllGalleryItemsForAdmin,
  getGalleryItems,
  updateGalleryItem,
} from "../api/galleryApi";

export const useGallery = (filters = {}) => {
  return useQuery({
    queryKey: ["gallery", filters],
    queryFn: () => getGalleryItems(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useInfiniteGallery = (filters = {}, limit = 16) => {
  return useInfiniteQuery({
    queryKey: ["gallery-infinite", filters, limit],
    queryFn: ({ pageParam = 1 }) =>
      getGalleryItems({
        ...filters,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage || undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useAdminGallery = (filters = {}) => {
  return useQuery({
    queryKey: ["admin-gallery", filters],
    queryFn: () => getAllGalleryItemsForAdmin(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });
};