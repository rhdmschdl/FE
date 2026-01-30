import axiosInstance from "@/apis/axios";

export type DeleteGalleryRequest = {
  galleryIds: Array<number>;
};

export type DeleteGalleryResponse = void;

export async function deleteGalleryApi(
  archiveId: string | number,
  payload: DeleteGalleryRequest
): Promise<DeleteGalleryResponse> {
  const url = `/api/v1/gallery/${archiveId}`;
  const res = await axiosInstance.delete(url, {
    data: payload,
  });
  return res.data;
}

export default deleteGalleryApi;
