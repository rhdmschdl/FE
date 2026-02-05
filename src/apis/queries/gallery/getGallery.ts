import axiosInstance from "@/apis/axios";
import type { GetGalleryRequest, GetGalleryResponse } from "@/types/gallery";

export const getGallery = async (
  data: GetGalleryRequest
): Promise<GetGalleryResponse> => {
  const {
    archiveId,
    page = 0,
    size = 9,
    sort = "createdAt",
    direction = "DESC",
  } = data;
  const response = await axiosInstance.get<GetGalleryResponse>(
    `/api/v1/gallery/${archiveId}`,
    { params: { page, size, sort, direction } }
  );
  return response.data;
};
