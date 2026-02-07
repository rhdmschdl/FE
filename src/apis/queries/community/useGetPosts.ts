import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/apis/queries/community/getPost";
import type { GetPostsResponse } from "@/apis/queries/community/getPost";
import { queryKeys } from "@/constants/queryKeys";
import type { CommunitySortBy } from "@/enums/communitySortBy";

export type GetPostsParams = {
  page?: number;
  size?: number;
  category?: string;
  sortBy?: CommunitySortBy;
};

export const useGetPosts = (params: GetPostsParams) => {
  return useQuery<GetPostsResponse>({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params),
    retry: false,
  });
};
