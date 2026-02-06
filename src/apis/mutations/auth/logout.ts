import axiosInstance from "@/apis/axios";
import type { LogoutResponse, WithdrawResponse,
  ProviderLogoutUrlResponse
} from "@/types/auth/logout";  // ✅ Writer : Hooby

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
// ✅ Writer : Hooby: 로그아웃 URL 조회 API
export const getProviderLogoutUrls = async (): Promise<ProviderLogoutUrlResponse> => {
  const response = await axiosInstance.get<ProviderLogoutUrlResponse>(
    "/api/v1/auth/provider-logout-urls"
  );
  return response.data;
};
