import axiosInstance from "@/apis/axios";
import type {
  UpdateGalleryRequest,
  UpdateGalleryResponse,
} from "@/types/gallery";

export const updateGallery = async (
  data: UpdateGalleryRequest
): Promise<UpdateGalleryResponse> => {
  const { archiveId, title } = data;
  const response = await axiosInstance.patch<UpdateGalleryResponse>(
    `/api/v1/gallery/${archiveId}`,
    { title }
  );
  return response.data;
};
