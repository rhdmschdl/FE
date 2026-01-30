import { axiosInstance } from "@/apis/axios";
import type {
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
} from "@/types/auth/signup";

/**
 * 회원가입 API
 * POST /api/v1/auth/register
 */
export const registerUser = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>(
    "/api/v1/auth/register", // ✅ 직접 경로 지정
    data
  );
  return response.data;
};

// 이메일 인증번호 발송 API
export const sendVerificationCode = async (
  data: SendVerificationCodeRequest
): Promise<SendVerificationCodeResponse> => {
  const response = await axiosInstance.post<SendVerificationCodeResponse>(
    "/api/v1/auth/email/send", // ✅ 실제 엔드포인트로 변경
    null,
    {
      params: {
        // ✅ query parameter로 전달
        email: data.email,
      },
    }
  );
  return response.data;
};

//이메일 인증 번호 검증 API
export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> => {
  const response = await axiosInstance.post<VerifyEmailCodeResponse>(
    "/api/v1/auth/email/verify",
    data
  );
  return response.data;
};
