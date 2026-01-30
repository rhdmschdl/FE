import axiosInstance from "@/apis/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth/login";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/api/v1/auth/login",
    data
  );
  return response.data;
};
