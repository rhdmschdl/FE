import axiosInstance from "@/apis/axios";
import type {
  DeleteGalleryRequest,
  DeleteGalleryResponse,
} from "@/types/gallery";

export const deleteGallery = async (
  data: DeleteGalleryRequest
): Promise<DeleteGalleryResponse> => {
  const { archiveId, galleryIds } = data;
  const response = await axiosInstance.delete(`/api/v1/gallery/${archiveId}`, {
    data: { galleryIds },
  });
  return response.data;
};
