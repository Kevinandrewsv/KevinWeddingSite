import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "../api/uploadApi";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: uploadMedia,
  });
};