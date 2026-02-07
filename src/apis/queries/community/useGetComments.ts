import { useQuery } from "@tanstack/react-query";
import { fetchPostComments } from "@/apis/queries/community/getComments";
import type {
  GetCommentsResponse,
  GetCommentsOptions,
} from "@/apis/queries/community/getComments";
import { queryKeys } from "@/constants/queryKeys";

export const useGetComments = (
  postId: string | number | undefined,
  options: GetCommentsOptions = {}
) => {
  return useQuery<GetCommentsResponse>({
    queryKey: [...queryKeys.posts.detail(postId ?? ""), "comments", options],
    queryFn: () => fetchPostComments(postId!, options),
    enabled: !!postId,
    retry: false,
  });
};
