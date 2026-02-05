import axiosInstance from "@/apis/axios";
import type { UpdateRepostBookTitlePayload } from "@/types/repost";

export async function updateRepostBookTitleApi(
  repostBookId: string | number,
  payload: UpdateRepostBookTitlePayload
) {
  const id = String(repostBookId);
  const url = `/api/v1/repost/repost-book/${id}`;
  const res = await axiosInstance.patch(url, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  return res.data;
}

export default updateRepostBookTitleApi;
