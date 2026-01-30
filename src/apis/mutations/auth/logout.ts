import axiosInstance from "@/apis/axios";
import type { LogoutResponse, WithdrawResponse } from "@/types/auth/logout";

export const logout = async () => {
  const response = await axiosInstance.post<LogoutResponse>(
    "/api/v1/auth/logout"
  );
  return response.data;
};

export const withdraw = async () => {
  const response = await axiosInstance.delete<WithdrawResponse>(
    "/api/v1/auth/delete"
  );
  return response.data;
};
