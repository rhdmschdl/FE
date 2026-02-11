import axiosInstance from "@/apis/axios";
import type { UpdateMeRequest, UpdateMeResponse } from "@/types/user";

export const updateUser = async (
  data: UpdateMeRequest
): Promise<UpdateMeResponse> => {
  const response = await axiosInstance.patch<UpdateMeResponse>(
    "/api/v1/users/me",
    data
  );
  return response.data;
};
