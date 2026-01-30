import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiary } from "@/apis/mutations/diary/deleteDiary";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { DeleteDiaryRequest, DeleteDiaryResponse } from "@/types/diary";

export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteDiaryResponse,
    ApiError<ApiErrorBody>,
    DeleteDiaryRequest
  >({
    mutationFn: (data) => deleteDiary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.diaryBook.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
