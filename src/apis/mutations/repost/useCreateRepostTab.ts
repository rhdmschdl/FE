import { useMutation, useQueryClient } from "@tanstack/react-query";
import createRepostTabApi from "./createRepostTab";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { CreateRepostTabPayload } from "@/types/repost";

type Vars = {
  archiveId: string | number;
  payload?: CreateRepostTabPayload;
};

export const useCreateRepostTab = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ApiError<ApiErrorBody>, Vars>({
    mutationFn: ({ archiveId, payload }) =>
      createRepostTabApi(archiveId, payload),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useCreateRepostTab error:", error);
    },
    retry: false,
  });
};
