import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteRepostApi from "@/apis/mutations/repost/deleteRepost";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { DeleteRepostResponse } from "@/types/repost";

type Vars = {
  repostId: string | number;
};

export const useDeleteRepost = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRepostResponse, ApiError<ApiErrorBody>, Vars>({
    mutationFn: ({ repostId }) => deleteRepostApi(repostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useDeleteRepost error:", error);
    },
    retry: false,
  });
};
