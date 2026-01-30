import { useQuery } from "@tanstack/react-query";
import { getDiary, getDiaryBook } from "@/apis/queries/diary/getDiary";
import { queryKeys } from "@/constants/queryKeys";
import type {
  GetDiaryRequest,
  GetDiaryResponse,
  GetDiaryBookRequest,
  GetDiaryBookResponse,
} from "@/types/diary";

export const useGetDiary = (params: GetDiaryRequest) => {
  return useQuery<GetDiaryResponse>({
    queryKey: queryKeys.diary.detail(params.diaryId),
    queryFn: () => getDiary(params),
    enabled: !!params.diaryId,
    retry: false,
  });
};

export const useGetDiaryBook = (params: GetDiaryBookRequest) => {
  return useQuery<GetDiaryBookResponse>({
    queryKey: [
      ...queryKeys.diaryBook.detail(params.archiveId),
      params.page,
      params.size,
    ],
    queryFn: () => getDiaryBook(params),
    enabled: !!params.archiveId,
    retry: false,
  });
};
