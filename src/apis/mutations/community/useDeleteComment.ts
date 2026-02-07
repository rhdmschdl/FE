import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi } from "@/apis/mutations/community/deleteComment";
import type { DeleteCommentResponse } from "@/apis/mutations/community/deleteComment";
import { queryKeys } from "@/constants/queryKeys";

export const useDeleteComment = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCommentResponse, Error, number | string>({
    mutationFn: (commentId) => deleteCommentApi(commentId),
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(postId),
        });
      }
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
    },
  });
};
