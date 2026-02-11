import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentApi } from "@/apis/mutations/community/createComments";
import type {
  CreateCommentRequest,
  CreateCommentResponseDto,
} from "@/apis/mutations/community/createComments";
import { queryKeys } from "@/constants/queryKeys";

export const useCreateComment = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<CreateCommentResponseDto, Error, CreateCommentRequest>({
    mutationFn: (data) => createCommentApi(data),
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.posts.detail(postId), "comments"],
        });
      }
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
    },
  });
};
