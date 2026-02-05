import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import createRepostApi from "./createRepost";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { CreateRepostPayload, RepostItem } from "@/types/repost";

type Vars = {
  tabId: string | number;
  payload: CreateRepostPayload;
};

export const useCreateRepost = () => {
  const queryClient = useQueryClient();

  return useMutation<RepostItem, ApiError<ApiErrorBody>, Vars>({
    mutationFn: ({ tabId, payload }) => createRepostApi(tabId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useCreateRepost error:", error);
    },
    retry: false,
  });
};
