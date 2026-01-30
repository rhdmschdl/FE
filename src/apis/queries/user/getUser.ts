import axiosInstance from "@/apis/axios";
import type {
  GetMeResponse,
  GetUserRequest,
  GetUserResponse,
} from "@/types/user";

export const getMe = async (): Promise<GetMeResponse> => {
  const response = await axiosInstance.get<GetMeResponse>(`/api/v1/users/me`);
  return response.data;
};

export const getUser = async (
  data: GetUserRequest
): Promise<GetUserResponse> => {
  const { userId } = data;
  const response = await axiosInstance.get<GetUserResponse>(
    `/api/v1/users/${userId}`
  );
  return response.data;
};
