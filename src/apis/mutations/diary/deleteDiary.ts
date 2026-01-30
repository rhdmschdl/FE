import axiosInstance from "@/apis/axios";
import type { DeleteDiaryRequest, DeleteDiaryResponse } from "@/types/diary";

export const deleteDiary = async (
  data: DeleteDiaryRequest
): Promise<DeleteDiaryResponse> => {
  const { diaryId } = data;
  const response = await axiosInstance.delete<DeleteDiaryResponse>(
    `/api/v1/diary/${diaryId}`
  );
  return response.data;
};
