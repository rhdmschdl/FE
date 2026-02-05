import { useQuery } from "@tanstack/react-query";
import { getGallery } from "./getGallery";
import { queryKeys } from "@/constants/queryKeys";
import type { GetGalleryRequest, GetGalleryResponse } from "@/types/gallery";

export const useGetGallery = (
  params: GetGalleryRequest & { refetchInterval?: number | false }
) => {
  return useQuery<GetGalleryResponse>({
    queryKey: [
      ...queryKeys.gallery.list(Number(params.archiveId)),
      params.page,
      params.size,
      params.sort,
      params.direction,
    ],
    queryFn: () => getGallery(params),
    enabled: !!params.archiveId,
    retry: false,
    refetchInterval: params.refetchInterval,
  });
};
