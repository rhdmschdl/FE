import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRepostBookTitleApi } from "./updateRepostBookTitle";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  UpdateRepostBookTitlePayload,
  UpdateRepostBookTitleResponse,
} from "@/types/repost";

type Vars = {
  repostBookId: string | number;
  payload: UpdateRepostBookTitlePayload;
};

export const useUpdateRepostBookTitle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRepostBookTitleResponse,
    ApiError<ApiErrorBody>,
    Vars
  >({
    mutationFn: ({ repostBookId, payload }) =>
      updateRepostBookTitleApi(repostBookId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useUpdateRepostBookTitle error:", error);
    },
    retry: false,
  });
};
