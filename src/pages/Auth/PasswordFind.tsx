import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BtnBasic } from "@/components/common/Button/Btn";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendVerificationCode, verifyEmailCode } from "@/apis/mutations/auth/signup";
import { resetPassword } from "@/apis/mutations/auth/resetPw";

// 비밀번호 스키마
const passwordSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/,
        {
          message:
            "비밀번호는 8~16자의 영문, 숫자, 특수문자를 모두 포함해야 합니다.",
        }
      ),
    passwordCheck: z.string(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다. 다시 확인해주세요.",
    path: ["passwordCheck"],
  });

type PasswordFormFields = z.infer<typeof passwordSchema>;

const PasswordFind = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  // 인증번호 확인 성공 여부
  const [isVerified, setIsVerified] = useState(false);
  // 인증번호 확인 에러 메시지
  const [codeError, setCodeError] = useState("");
  // 인증번호 확인 중 여부
  const [_, setIsVerifying] = useState(false); //isVerifying
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);

  // 이메일 인증번호 발송 mutation
  const sendVerificationCodeMutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
      console.log("인증번호 발송 성공:", data);
    },
    onError: (error) => {
      console.error("인증번호 발송 실패:", error);
    },
  });
  // 이메일 인증번호 확인 mutation
  const verifyEmailCodeMutation = useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: (data) => {
      console.log("인증번호 확인 성공:", data);
    },
    onError: (error) => {
      console.error("인증번호 확인 실패:", error);
    },
  });
  // 비밀번호 재설정 mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("비밀번호 재설정 성공:", data);
    },
    onError: (error) => {
      console.error("비밀번호 재설정 실패:", error);
    },
  });

  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PasswordFormFields>({
    defaultValues: {
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  // Step 1: 이메일 확인
  const handleEmailSubmit = async () => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      console.log("인증번호 발송:", email);
      sendVerificationCodeMutation.mutate({ email });
      // 인증번호 발송 성공 시
      setEmailError("");
      setStep(2);
    } catch (error) {
      // 발송 실패 시
      setEmailError("인증번호 발송에 실패했습니다.");
    }
  };

  // Step 2: 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      //인증번호 확인 API 호출 => 실제 API는 purpose도 존재해야함
      setIsVerifying(true);
      setCodeError(""); // 에러 초기화
      console.log("인증번호 확인:", { email, verificationCode });
      verifyEmailCodeMutation.mutate({ email, code: verificationCode, purpose: "PASSWORD_RESET" });
      setIsVerified(true);
      setStep(3);
    } catch (error) {
      setCodeError("인증번호가 올바르지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 인증번호 재전송
  const handleResendCode = () => {
    console.log("인증번호 재발송:", email);
    sendVerificationCodeMutation.mutate({ email });
    setVerificationCode("");
    setIsVerified(false);
  };

  // Step 3: 비밀번호 재설정 완료
  const handlePasswordReset = async () => {
    const isValid = await trigger(["password", "passwordCheck"]);

    if (!isValid) return;

    const password = watch("password");

    try {
      // 비밀번호 재설정 API 호출
      console.log("비밀번호 재설정:", { email, password });
      resetPasswordMutation.mutate({ email, password });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (error) {
      alert("비밀번호 재설정에 실패했습니다.");
    }
  };
  // 비밀번호 재설정 폼 터치 여부
  const [touchedFields, setTouchedFields] = useState({
    password: false,
    passwordCheck: false,
  });
  // 비밀번호 blur 핸들러 추가
  const handlePasswordBlur = () => {
    setTouchedFields((prev) => ({ ...prev, password: true }));
    const password = watch("password");
    if (password) {
      trigger("password");
    }
  };

  const handlePasswordCheckBlur = () => {
    setTouchedFields((prev) => ({ ...prev, passwordCheck: true }));
    const passwordCheck = watch("passwordCheck");
    if (passwordCheck) {
      trigger("passwordCheck");
    }
  };
  // 인증번호 입력 완료 여부
  const isCodeComplete = verificationCode.length === 6;
  // 비밀번호 재설정 폼 유효성 검사
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const isPasswordFormValid =
    password && passwordCheck && !errors.password && !errors.passwordCheck;

  return (
    <div className="w-full h-screen bg-surface-container-10 flex flex-col items-center gap-33">
      {/* 헤더 */}
      {step === 1 && (
        <p className="mt-33 typo-h1 text-color-highest">비밀번호 찾기</p>
      )}
      {step === 2 && (
        <p className="mt-33 typo-h1 text-color-highest">비밀번호 재설정</p>
      )}
      {step === 3 && (
        <p className="mt-33 typo-h1 text-color-highest">비밀번호 재설정</p>
      )}

      {/* 비밀번호 찾기 폼 */}
      <div className="w-[951px] px-30 py-16 rounded-xl bg-surface-bg flex flex-col items-center justify-center">
        {/* Step 1: 이메일 입력 */}
        {step === 1 && (
          <div className="w-[711px] flex flex-col items-center gap-15">
            <div className="w-full flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="이메일을 입력해주세요."
                className={`w-full h-[65px] p-5 rounded-xl border-2 typo-h2
                  placeholder:text-color-low outline-none
                  ${emailError ? "border-red-500" : "border-border-mid"}
                  focus:border-brand-blue-400`}
              />
              {emailError && (
                <p className="typo-h3 text-red-500">{emailError}</p>
              )}
            </div>
            <BtnBasic
              className="w-full h-[65px]"
              variant="blue"
              onClick={handleEmailSubmit}
              disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            >
              <p className="typo-h3-semibold">비밀번호 찾기</p>
            </BtnBasic>
          </div>
        )}

        {/* Step 2: 인증번호 입력 */}
        {step === 2 && (
          <div className="w-[711px] flex flex-col items-center gap-15">
            <div className="w-full flex flex-col justify-between items-center gap-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                disabled={isVerified}
                className={`w-full h-[65px] p-5 rounded-xl border-2 typo-h2 
                  placeholder:text-color-low outline-none
                  ${isVerified
                    ? "border-green-500 bg-green-50 text-color-highest"
                    : codeError
                      ? "border-red-500 text-color-highest"
                      : "border-border-mid text-color-highest focus:border-brand-blue-400"
                  }
                  `}
                placeholder="인증번호를 입력해주세요"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ""));
                  setCodeError(""); // 입력 시 에러 초기화
                }}
              />
              {codeError && (
                <p className="w-full typo-h3 text-accent">{codeError}</p>
              )}
              {isVerified ? (
                <p className="typo-h3 text-green-600">
                  ✓ 이메일 인증이 완료되었습니다.
                </p>
              ) : (
                <div className="w-full flex">
                  <p className="typo-h3 text-color-mid">
                    메일을 받지 못하셨나요? 스팸함을 확인하거나{"  "}
                  </p>
                  <p
                    onClick={handleResendCode}
                    className="pl-1 typo-h3 text-color-primary cursor-pointer"
                  >
                    [재전송]
                  </p>
                  <p className="typo-h3 text-color-mid">을 눌러주세요.</p>
                </div>
              )}
            </div>

            <BtnBasic
              className="w-full h-[65px]"
              variant="blue"
              onClick={handleVerifyCode}
              disabled={!isCodeComplete || isVerified}
            >
              <p className="typo-h3-semibold">인증하고 비밀번호 찾기</p>
            </BtnBasic>
          </div>
        )}

        {/* Step 3: 비밀번호 재설정 */}
        {step === 3 && (
          <div className="w-[711px] flex flex-col gap-15">
            {/* 비밀번호 */}
            <div className="w-full flex flex-col gap-4">
              <div
                className={`h-[65px] gap-2.5 flex p-5 justify-between items-center rounded-xl border-2
                  focus-within:border-brand-blue-400
                  ${touchedFields.password && password && errors.password
                    ? "border-red-500"
                    : "border-border-mid"
                  }`}
              >
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"}
                  className="flex-1 typo-h2 text-color-highest placeholder:text-color-low outline-none"
                  placeholder="새 비밀번호를 입력해주세요."
                  autoComplete="new-password"
                  onBlur={handlePasswordBlur}
                />
                {isPasswordVisible ? (
                  <Eye
                    className="w-6 h-6 text-color-mid cursor-pointer"
                    onClick={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <EyeOff
                    className="w-6 h-6 text-color-mid cursor-pointer"
                    onClick={() => setIsPasswordVisible(true)}
                  />
                )}
              </div>

              <div
                className={`h-[65px] gap-2.5 flex p-5 justify-between items-center rounded-xl border-2
                  focus-within:border-brand-blue-400
                  ${touchedFields.passwordCheck &&
                    passwordCheck &&
                    errors.passwordCheck
                    ? "border-red-500"
                    : "border-border-mid"
                  }`}
              >
                <input
                  {...register("passwordCheck")}
                  type={isPasswordCheckVisible ? "text" : "password"}
                  className="flex-1 typo-h2 text-color-highest placeholder:text-color-low outline-none"
                  placeholder="비밀번호가 일치하는지 확인해주세요."
                  autoComplete="new-password"
                  onBlur={handlePasswordCheckBlur}
                />
                {isPasswordCheckVisible ? (
                  <Eye
                    className="w-6 h-6 text-color-mid cursor-pointer"
                    onClick={() => setIsPasswordCheckVisible(false)}
                  />
                ) : (
                  <EyeOff
                    className="w-6 h-6 text-color-mid cursor-pointer"
                    onClick={() => setIsPasswordCheckVisible(true)}
                  />
                )}
              </div>

              {/* 값이 있고 에러가 있을 때만 표시 */}
              {touchedFields.password && password && errors.password ? (
                <p className="typo-h3 text-red-500">
                  {errors.password.message}
                </p>
              ) : touchedFields.passwordCheck &&
                passwordCheck &&
                errors.passwordCheck ? (
                <p className="typo-h3 text-red-500">
                  {errors.passwordCheck.message}
                </p>
              ) : null}
            </div>

            <BtnBasic
              className="w-full h-[65px]"
              variant="blue"
              onClick={handlePasswordReset}
              disabled={!isPasswordFormValid}
            >
              <p className="typo-h3-semibold">비밀번호 재설정</p>
            </BtnBasic>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordFind;
