import axiosInstance from "@/apis/axios";
import type { CreateRepostPayload } from "@/types/repost";
import type { RepostItem } from "@/types/repost";

export async function createRepostApi(
  tabId: string | number,
  payload: CreateRepostPayload,
  signal?: AbortSignal
): Promise<RepostItem> {
  if (tabId === undefined || tabId === null) {
    throw new Error("tabId가 필요합니다.");
  }
  if (!payload?.url || typeof payload.url !== "string") {
    throw new Error("유효한 url이 필요합니다.");
  }

  const res = await axiosInstance.post<RepostItem>(
    `/api/v1/repost/${String(tabId)}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal,
    }
  );

  return res.data;
}

export default createRepostApi;
