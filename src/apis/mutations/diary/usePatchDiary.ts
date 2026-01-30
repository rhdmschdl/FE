import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateDiary,
  updateDiaryBook,
} from "@/apis/mutations/diary/patchDiary";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  UpdateDiaryBookRequest,
  UpdateDiaryBookResponse,
  UpdateDiaryRequest,
  UpdateDiaryResponse,
} from "@/types/diary";

export const useUpdateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateDiaryResponse,
    ApiError<ApiErrorBody>,
    UpdateDiaryRequest
  >({
    mutationFn: (data) => updateDiary(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diaryBook.all });
      queryClient.setQueryData(queryKeys.diary.detail(variables.diaryId), data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateDiaryBook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateDiaryBookResponse,
    ApiError<ApiErrorBody>,
    UpdateDiaryBookRequest
  >({
    mutationFn: (data) => updateDiaryBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diaryBook.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
