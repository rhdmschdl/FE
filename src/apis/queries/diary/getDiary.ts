import axiosInstance from "@/apis/axios";
import type {
  GetDiaryBookRequest,
  GetDiaryBookResponse,
  GetDiaryRequest,
  GetDiaryResponse,
} from "@/types/diary";

export const getDiary = async (
  data: GetDiaryRequest
): Promise<GetDiaryResponse> => {
  const { diaryId } = data;
  const response = await axiosInstance.get<GetDiaryResponse>(
    `/api/v1/diary/${diaryId}`
  );
  return response.data;
};

export const getDiaryBook = async (
  data: GetDiaryBookRequest
): Promise<GetDiaryBookResponse> => {
  const { archiveId, page, size } = data;
  const response = await axiosInstance.get<GetDiaryBookResponse>(
    `/api/v1/diary/book/${archiveId}`,
    {
      params: { page, size },
    }
  );
  return response.data;
};
