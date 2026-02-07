import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunityPost } from "@/apis/mutations/community/createPost";
import type {
  CreatePostPayload,
  CreatePostResponse,
} from "@/apis/mutations/community/createPost";
import { queryKeys } from "@/constants/queryKeys";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostResponse, Error, CreatePostPayload>({
    mutationFn: (data) => createCommunityPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
    },
  });
};
