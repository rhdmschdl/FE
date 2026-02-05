import axiosInstance from "@/apis/axios";
import type { AddGalleryRequest, AddGalleryResponse } from "@/types/gallery";

export const addGallery = async (
  data: AddGalleryRequest
): Promise<AddGalleryResponse> => {
  const { archiveId, fileIds } = data;
  const response = await axiosInstance.post<AddGalleryResponse>(
    `/api/v1/gallery/${archiveId}`,
    { fileIds }
  );
  return response.data;
};
