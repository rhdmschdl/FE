import axiosInstance from "@/apis/axios";

export type UpdateGalleryTitlePayload = {
  title: string;
};

export async function updateGalleryTitleApi(
  archiveId: string | number,
  payload: UpdateGalleryTitlePayload
) {
  const id = String(archiveId);
  const url = `/api/v1/gallery/${id}`;
  const res = await axiosInstance.patch(url, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  return res.data;
}

export default updateGalleryTitleApi;
