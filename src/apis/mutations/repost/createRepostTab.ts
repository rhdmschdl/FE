import axiosInstance from "@/apis/axios";
import type { CreateRepostTabPayload } from "@/types/repost";

export async function createRepostTabApi(
  archiveId: string | number,
  payload: CreateRepostTabPayload = {}
) {
  if (archiveId === undefined || archiveId === null)
    throw new Error("archiveId가 필요합니다.");
  const url = `/api/v1/repost/tabs/${String(archiveId)}`;
  const res = await axiosInstance.post(url, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  return res.data;
}

export default createRepostTabApi;
