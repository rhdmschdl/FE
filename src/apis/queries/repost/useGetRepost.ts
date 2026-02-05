import { useQuery } from "@tanstack/react-query";
import fetchRepostBookApi from "./fetchRepostBook";
import type { RepostBookResponse } from "@/types/repost";
import type { UseGetRepostParams } from "@/types/repost";
import { queryKeys } from "@/constants/queryKeys";

export const useGetRepost = (opts: UseGetRepostParams) => {
  const {
    archiveId,
    page = 0,
    size = 9,
    sort = "createdAt",
    direction = "DESC",
    tabId,
    enabled,
  } = opts;

  // 기본 키 생성
  const baseKey = queryKeys.repost.list(archiveId ?? "");

  return useQuery<RepostBookResponse>({
    queryKey: [...baseKey, page, size, sort, direction, tabId ?? null],
    queryFn: () =>
      fetchRepostBookApi(archiveId ?? "", {
        page,
        size,
        sort,
        direction,
        tabId: tabId === null ? undefined : tabId,
      }),
    enabled: !!archiveId && enabled !== false,
    retry: false,
  });
};
