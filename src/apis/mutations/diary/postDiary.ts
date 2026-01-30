import axiosInstance from "@/apis/axios";
import type { AddDiaryRequest, AddDiaryResponse } from "@/types/diary";

export const addDiary = async (
  data: AddDiaryRequest
): Promise<AddDiaryResponse> => {
  const { archiveId, ...body } = data;
  const response = await axiosInstance.post<AddDiaryResponse>(
    `/api/v1/diary/${archiveId}`,
    body
  );
  return response.data;
};
