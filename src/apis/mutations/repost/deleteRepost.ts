import axiosInstance from "@/apis/axios";
import type { DeleteRepostResponse } from "@/types/repost";

export async function deleteRepostApi(
  repostId: string | number,
  signal?: AbortSignal
): Promise<DeleteRepostResponse> {
  if (repostId === undefined || repostId === null) {
    throw new Error("repostId가 필요합니다.");
  }

  const url = `/api/v1/repost/${String(repostId)}`;

  await axiosInstance.delete(url, {
    signal,
  });

  return;
}

export default deleteRepostApi;
