import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import SignupStepBar from "@/components/auth/signup/SignupStepBar";
import SignupStep1 from "@/components/auth/signup/signupStep1";
import SignupStep2 from "@/components/auth/signup/signupStep2";
import SignupStep3 from "@/components/auth/signup/signupStep3";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  sendVerificationCode,
} from "@/apis/mutations/auth/signup";
import { AxiosError } from "axios";

// Step 2 스키마 (이메일, 비밀번호, 닉네임)
export const schema = z
  .object({
    emailId: z.string(),
    emailDomain: z.string(),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(16, { message: "비밀번호는 16자 이하여야 합니다." })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/,
        {
          message:
            "8 ~ 16자 이내 영문, 숫자, 특수문자를 모두 포함하여 입력해주세요.",
        }
      ),
    passwordCheck: z.string(),
    nickname: z
      .string()
      .min(2, { message: "2~10자 이내 한글, 영어, 숫자, -, _ 중에 작성해 주세요." })
      .max(10, { message: "2~10자 이내 한글, 영어, 숫자, -, _ 중에 작성해 주세요." })
      .regex(/^[가-힣a-zA-Z0-9-_]+$/, {
        message: "2~10자 이내 한글, 영어, 숫자, -, _ 중에 작성해 주세요.",
      }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  })
  // 이메일 합쳐서 검증
  .refine(
    (data) => {
      const email = `${data.emailId}@${data.emailDomain}`;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    {
      message: "유효한 이메일 주소를 입력해주세요.",
      path: ["emailId"], // 에러 표시 위치
    }
  );

export type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  // 회원가입 mutation 추가
  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다!");
      navigate("/login", {
        state: { email: signupData?.email || "" },
      });
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      if (error instanceof AxiosError && error.response?.status === 429) {
        alert("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    },
  });
  // 인증번호 발송 mutation 추가
  const sendVerificationCodeMutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
      console.log("인증번호 발송 성공:", data);
    },
    onError: (error) => {
      console.error("인증번호 발송 실패:", error);
      if (error instanceof AxiosError && error.response?.status === 429) {
        alert("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
    },
  });

  // Step 단계 관리
  const [step, setStep] = useState(1);
  // Step 1: 약관 동의 상태
  const [checkedAgreements, setCheckedAgreements] = useState<
    Record<string, boolean>
  >({
    all: false,
    terms: false,
    privacy: false,
  });
  // Step 2에서 입력한 회원가입 데이터 저장
  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
    nickname: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    defaultValues: {
      emailId: "",
      emailDomain: "",
      password: "",
      passwordCheck: "",
      nickname: "",
    },
    resolver: zodResolver(schema), // 유효성 검사 규칙
    mode: "onBlur", // onBlur로 설정 (onChange 아님!)
  });

  // email 조합 완성
  // 이메일 합쳐서 사용 (Step 3에서 보여줄 때)
  // const emailId = watch("emailId");
  // const emailDomain = watch("emailDomain");
  // const email = emailId && emailDomain ? `${emailId}@${emailDomain}` : "";

  // 약관 동의 핸들러
  const handleAgreementChange = (id: string) => {
    if (id === "all") {
      const newValue = !checkedAgreements.all;
      setCheckedAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
      });
    } else {
      const newChecked = {
        ...checkedAgreements,
        [id]: !checkedAgreements[id],
      };
      // 전체 동의 체크 상태 업데이트
      newChecked.all = newChecked.terms && newChecked.privacy;
      setCheckedAgreements(newChecked);
    }
  };

  // 필수 약관 동의 여부 확인
  const isRequiredAgreed = checkedAgreements.terms && checkedAgreements.privacy;

  // 회원가입 완료 API 호출 => mutaion으로 실제 api 연결
  const handleCompleteSignup = () => {
    if (signupData) {
      signupMutation.mutate({
        email: signupData.email,
        password: signupData.password,
        nickname: signupData.nickname,
      });
    }
  };

  // 다음 단계로 이동
  const handleNext = async () => {
    if (step === 1) {
      // Step 1: 필수 약관 동의 확인
      if (isRequiredAgreed) {
        setStep(2);
      }
    } else if (step === 2) {
      // Step 2: 폼 유효성 검사 + 이메일 인증번호 발송 API 호출
      const isValid = await trigger([
        "emailId",
        "emailDomain",
        "password",
        "passwordCheck",
        "nickname",
      ]);
      if (isValid) {
        const emailId = watch("emailId");
        const emailDomain = watch("emailDomain");
        const password = watch("password");
        const nickname = watch("nickname");

        const email = `${emailId}@${emailDomain}`;

        // 회원가입 데이터 저장 (Step 3에서 사용)
        setSignupData({
          email,
          password,
          nickname,
        });

        // 인증번호 발송 API 호출 => mutaion으로 실제 api 연결
        sendVerificationCodeMutation.mutate(
          {
            email,
          },
          {
            onSuccess: () => setStep(3),
            onError: (error) => {
              if (error instanceof AxiosError && error.response?.status === 429) {
                return;
              }
              alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
            },
          }
        );
      }
    }
  };

  // 이전 단계로 이동
  // const handlePrev = () => {
  //   setStep((prev) => Math.max(prev - 1, 1));
  // };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { passwordCheck, ...rest } = data;
    console.log("회원가입 데이터:", rest);

    // TODO: API 호출 - 회원가입
  };

  return (
    <div className="w-full h-screen bg-[#F4F5F9]">
      <div className="max-w-[951px] mx-auto py-15 flex flex-col items-center justify-center gap-15">
        {/* 헤더 */}
        <p className="typo-h1 text-color-highest">회원가입</p>
        {/* 단계 표시 */}
        {/* Step Bar 컴포넌트 사용 */}
        <SignupStepBar currentStep={step} />

        <div className="w-full px-30 py-16 rounded-xl bg-white flex flex-col items-center justify-center">
          {/* 폼 컨테이너 */}
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            {step === 1 && (
              <SignupStep1
                checkedAgreements={checkedAgreements}
                onAgreementChange={handleAgreementChange}
                onClick={handleNext}
              />
            )}
            {step === 2 && (
              <SignupStep2
                register={register}
                control={control}
                errors={errors}
                trigger={trigger}
                onClick={handleNext}
                isValid={isValid}
                watch={watch}
              />
            )}
            {step === 3 && (
              <SignupStep3
                email={signupData?.email || ""}
                onComplete={handleCompleteSignup}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
