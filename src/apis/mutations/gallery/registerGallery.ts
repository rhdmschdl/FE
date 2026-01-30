import axiosInstance from "@/apis/axios";

export type RegisterGalleryRequest = {
  fileIds: number[];
};

export type RegisterGalleryResponse = {
  createdCount?: number;
  archiveId?: number;
};

export async function registerGalleryApi(
  archiveId: string | number,
  payload: RegisterGalleryRequest
): Promise<RegisterGalleryResponse> {
  const res = await axiosInstance.post<RegisterGalleryResponse>(
    `/api/v1/gallery/${archiveId}`,
    payload
  );
  return res.data;
}

export default registerGalleryApi;
