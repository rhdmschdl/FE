import axiosInstance from "@/apis/axios";
import type { UpdateRepostTabTitlePayload } from "@/types/repost";

export async function updateRepostTabTitleApi(
  tabId: string | number,
  payload: UpdateRepostTabTitlePayload
) {
  if (tabId === undefined || tabId === null) {
    throw new Error("tabId가 필요합니다.");
  }
  const url = `/api/v1/repost/tabs/${String(tabId)}`;
  const res = await axiosInstance.patch(url, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  return res.data;
}

export default updateRepostTabTitleApi;
