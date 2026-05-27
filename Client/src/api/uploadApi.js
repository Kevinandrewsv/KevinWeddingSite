import axiosInstance from "./axiosInstance";

export const uploadMedia = async (file) => {
  const formData = new FormData();

  formData.append("media", file);

  const response = await axiosInstance.post("/upload/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};