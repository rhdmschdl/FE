import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike } from "@/apis/mutations/community/toggleLike";
import type { ToggleLikeResponse } from "@/apis/mutations/community/toggleLike";
import { queryKeys } from "@/constants/queryKeys";

export const useToggleLike = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<ToggleLikeResponse, Error, string | number>({
    mutationFn: (id) => togglePostLike(id),
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(postId),
        });
      }
    },
    onError: (error) => {
      console.error("좋아요 토글 실패:", error);
    },
  });
};
