import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteRepostTabApi from "./deleteRepostTab";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";

type Vars = {
  tabId: string | number;
};

export const useDeleteRepostTab = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError<ApiErrorBody>, Vars>({
    mutationFn: ({ tabId }) => deleteRepostTabApi(tabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repost.all });
    },
    onError: (error) => {
      console.error("useDeleteRepostTab error:", error);
    },
    retry: false,
  });
};
