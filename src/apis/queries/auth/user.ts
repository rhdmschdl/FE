import { axiosInstance } from "@/apis/axios";
import type { SocialLoginGetMeResponse } from "@/types/auth/login";

/**
 * 현재 로그인된 사용자 정보 조회
 * GET /api/v1/auth/me
 */
export const socialLoginGetMe = async (): Promise<SocialLoginGetMeResponse> => {
  const response = await axiosInstance.get<SocialLoginGetMeResponse>(
    "/api/v1/auth/social/me"
  );
  return response.data;
};
