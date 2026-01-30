import axiosInstance from "@/apis/axios";
import type {
  UpdateDiaryBookRequest,
  UpdateDiaryBookResponse,
  UpdateDiaryRequest,
  UpdateDiaryResponse,
} from "@/types/diary";

export const updateDiary = async (
  data: UpdateDiaryRequest
): Promise<UpdateDiaryResponse> => {
  const { diaryId, ...body } = data;
  const response = await axiosInstance.patch<UpdateDiaryResponse>(
    `/api/v1/diary/${diaryId}`,
    body
  );
  return response.data;
};

export const updateDiaryBook = async (
  data: UpdateDiaryBookRequest
): Promise<UpdateDiaryBookResponse> => {
  const { archiveId, title } = data;
  const response = await axiosInstance.patch<UpdateDiaryBookResponse>(
    `/api/v1/diary/book/${archiveId}`,
    {
      title,
    }
  );
  return response.data;
};
