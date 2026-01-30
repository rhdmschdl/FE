import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDiary } from "@/apis/mutations/diary/postDiary";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { AddDiaryRequest, AddDiaryResponse } from "@/types/diary";

export const useAddDiary = () => {
  const queryClient = useQueryClient();

  return useMutation<AddDiaryResponse, ApiError<ApiErrorBody>, AddDiaryRequest>(
    {
      mutationFn: (data) => addDiary(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.diary.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.diaryBook.all });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
};
