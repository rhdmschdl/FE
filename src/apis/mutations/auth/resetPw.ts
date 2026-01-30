import axiosInstance from "@/apis/axios";
import type { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth/password";

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>(
    "/api/v1/auth/reset-pw",
    data
  );
  return response.data;
};