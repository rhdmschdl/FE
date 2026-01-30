import { useQuery } from "@tanstack/react-query";
import { GetArchiveDetail } from "@/apis/queries/archive/getArchive";
import { queryKeys } from "@/constants/queryKeys";
import type { ArchiveResponse } from "@/types/archive";

type UseGetArchiveParams = {
  archiveId: number;
};

export const useGetArchive = (params: UseGetArchiveParams) => {
  return useQuery<ArchiveResponse>({
    queryKey: queryKeys.archive.detail(params.archiveId),
    queryFn: () => GetArchiveDetail(params.archiveId),
    enabled: !!params.archiveId,
    retry: false,
  });
};
