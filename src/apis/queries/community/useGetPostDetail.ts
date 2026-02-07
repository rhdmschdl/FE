import { useQuery } from "@tanstack/react-query";
import { fetchPostDetail } from "@/apis/queries/community/getDetailPost";
import type { PostDetailDto } from "@/apis/queries/community/getDetailPost";
import { queryKeys } from "@/constants/queryKeys";

export const useGetPostDetail = (postId: string | number | undefined) => {
  return useQuery<PostDetailDto>({
    queryKey: queryKeys.posts.detail(postId ?? ""),
    queryFn: () => fetchPostDetail(postId!),
    enabled: !!postId,
    retry: false,
  });
};
