import axiosInstance from "@/apis/axios";
import type { RepostBookQueryParams, RepostBookResponse } from "@/types/repost";

export async function fetchRepostBookApi(
  archiveId: string | number,
  params: RepostBookQueryParams = {},
  signal?: AbortSignal
): Promise<RepostBookResponse> {
  if (archiveId === undefined || archiveId === null) {
    throw new Error("archiveId가 필요합니다.");
  }
  const id = String(archiveId);
  const query: Record<string, any> = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.size !== undefined) query.size = params.size;
  if (params.sort) query.sort = params.sort;
  if (params.direction) query.direction = params.direction;
  if (params.tabId !== undefined && params.tabId !== null)
    query.tabId = params.tabId;

  const res = await axiosInstance.get(`/api/v1/repost/${id}`, {
    params: query,
    signal,
  });
  return res.data;
}

export default fetchRepostBookApi;
