import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRepostTabTitleApi } from "./updateRepostTabTitle";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  UpdateRepostTabTitlePayload,
  UpdateRepostTabTitleResponse,
} from "@/types/repost";

type Vars = {
  tabId: string | number;
  payload: UpdateRepostTabTitlePayload;
};

export const useUpdateRepostTabTitle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRepostTabTitleResponse,
    ApiError<ApiErrorBody>,
    Vars
  >({
    mutationFn: ({ tabId, payload }) => updateRepostTabTitleApi(tabId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useUpdateRepostTabTitle error:", error);
    },
    retry: false,
  });
};
