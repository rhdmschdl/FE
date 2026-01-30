// ✅ 약관 동의 항목
export type Agreement = {
  id: string; // 약관 아이디
  label: string; // 약관 내용
  required: boolean; // 필수 여부
};

// 회원가입 요청
export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

// 회원가입 응답
export type SignupResponse = {
  id: number;
  email: string;
  role: string;
  nickname: string;
  createdAt: string;
  lastModifiedAt: string;
};
// 이메일 인증번호 발송 요청
export type SendVerificationCodeRequest = {
  email: string;
};

// 이메일 인증번호 발송 응답
export type SendVerificationCodeResponse = {
  message: string;
};

// 이메일 인증번호 검증 요청
export type VerifyEmailCodeRequest = {
  email: string;
  code: string;
  purpose: string;
};

// 이메일 인증번호 검증 응답
export type VerifyEmailCodeResponse = {
  message: string;
};
