import axiosInstance from "@/apis/axios";

export async function deleteRepostTabApi(tabId: string | number) {
  if (tabId === undefined || tabId === null) {
    throw new Error("tabId가 필요합니다.");
  }
  const url = `/api/v1/repost/tabs/${String(tabId)}`;
  const res = await axiosInstance.delete(url);
  return res.data;
}

export default deleteRepostTabApi;
