import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormTrigger,
  type UseFormWatch,
} from "react-hook-form";
import type { FormFields } from "@/pages/Auth/SignupPage";
import EmailSelectBox from "./EmailSelectBox";
import { BtnBasic } from "@/components/common/Button/Btn";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// 이메일 도메인 옵션
const emailDomainOptions = [
  { label: "naver.com", value: "naver.com" },
  { label: "daum.net", value: "daum.net" },
  { label: "gmail.com", value: "gmail.com" },
  { label: "nate.com", value: "nate.com" },
  { label: "hanmail.net", value: "hanmail.net" },
];

type SignupStep2Props = {
  register: UseFormRegister<FormFields>;
  control: Control<FormFields>;
  errors: FieldErrors<FormFields>;
  trigger: UseFormTrigger<FormFields>;
  onClick: () => void;
  isValid: boolean;
  watch: UseFormWatch<FormFields>;
};

const SignupStep2 = ({
  register,
  control,
  errors,
  trigger,
  onClick,
  isValid,
  watch,
}: SignupStep2Props) => {
  // 각 필드가 blur 되었는지 추적
  const [touchedFields, setTouchedFields] = useState({
    emailId: false,
    emailDomain: false,
    password: false,
    passwordCheck: false,
    nickname: false,
  });

  // 이메일 blur 핸들러
  const handleEmailBlur = () => {
    setTouchedFields((prev) => ({ ...prev, emailId: true, emailDomain: true }));

    const emailId = watch("emailId");
    const emailDomain = watch("emailDomain");

    if (emailId || emailDomain) {
      trigger(["emailId", "emailDomain"]);
    }
  };

  // 비밀번호 blur 핸들러
  const handlePasswordBlur = () => {
    setTouchedFields((prev) => ({ ...prev, password: true }));
    const password = watch("password");
    if (password) {
      trigger("password");
    }
  };

  // 비밀번호 확인 blur 핸들러
  const handlePasswordCheckBlur = () => {
    setTouchedFields((prev) => ({ ...prev, passwordCheck: true }));
    const passwordCheck = watch("passwordCheck");
    if (passwordCheck) {
      trigger("passwordCheck");
    }
  };

  // 닉네임 blur 핸들러
  const handleNicknameBlur = () => {
    setTouchedFields((prev) => ({ ...prev, nickname: true }));
    const nickname = watch("nickname");
    if (nickname) {
      trigger("nickname");
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPasswordCheckVisible, setIsPasswordCheckVisible] =
    useState<boolean>(false);

  // ✅ 간단하게 변경
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const togglePasswordCheckVisibility = () => {
    setIsPasswordCheckVisible((prev) => !prev);
  };

  return (
    <div className="w-[711px] flex flex-col gap-[34px] items-start">
      {/* 이메일 */}
      <div className="flex flex-col gap-4">
        <p className="typo-h2 text-color-highest">이메일</p>
        <div className="flex items-center gap-2">
          {/* 이메일 아이디 */}
          <input
            {...register("emailId")}
            type="text"
            autoComplete="off"
            onBlur={handleEmailBlur}
            className={`w-82 h-[65px] p-5 border-2 rounded-xl typo-h2 
              placeholder:text-color-low outline-none
              focus:border-brand-blue-400
              ${errors.emailId ? "border-border-accent" : "border-border-mid"}`}
            placeholder="이메일 아이디"
          />
          {/* @ 기호 */}
          <span className="typo-h2 text-color-highest">@</span>
          {/* 이메일 도메인 */}
          <Controller
            name="emailDomain"
            control={control}
            render={({ field }) => (
              <EmailSelectBox
                options={emailDomainOptions}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  // 이메일 아이디나 도메인 값이 있을 때만 검증
                  setTimeout(() => {
                    const emailId = watch("emailId");
                    if (emailId || value) {
                      trigger(["emailId", "emailDomain"]);
                    }
                  }, 100);
                }}
                placeholder="직접 입력"
                className="w-82"
                hasError={!!errors.emailDomain || !!errors.emailId}
                onBlur={handleEmailBlur}
              />
            )}
          />
        </div>
        {/* 에러 메시지 */}
        {(errors.emailId || errors.emailDomain) && (
          <p className="typo-h3 text-color-accent">
            {errors.emailId?.message || errors.emailDomain?.message}
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="w-full flex flex-col gap-4">
        <p className="typo-h2 text-color-highest">비밀번호</p>
        <div
          className={`h-[65px] gap-2.5 flex p-5 justify-between items-center rounded-xl border-2
            focus-within:border-brand-blue-400
            ${errors.password ? "border-border-accent" : "border-border-mid"}`}
        >
          <input
            {...register("password")}
            type={isPasswordVisible ? "text" : "password"}
            className="flex-1 typo-h2 text-color-highest placeholder:text-color-low outline-none"
            placeholder="비밀번호"
            autoComplete="new-password"
            onBlur={handlePasswordBlur}
          />
          {isPasswordVisible ? (
            <Eye
              className="w-6 h-6 text-color-mid cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <EyeOff
              className="w-6 h-6 text-color-mid cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>

        <div
          className={`h-[65px] gap-2.5 flex p-5 justify-between items-center rounded-xl border-2
            focus-within:border-brand-blue-400
            ${
              errors.passwordCheck
                ? "border-border-accent"
                : "border-border-mid"
            }`}
        >
          <input
            {...register("passwordCheck")}
            type={isPasswordCheckVisible ? "text" : "password"}
            className="flex-1 typo-h2 text-color-highest placeholder:text-color-low outline-none"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            onBlur={handlePasswordCheckBlur}
          />
          {isPasswordCheckVisible ? (
            <Eye
              className="w-6 h-6 text-color-mid cursor-pointer"
              onClick={togglePasswordCheckVisibility}
            />
          ) : (
            <EyeOff
              className="w-6 h-6 text-color-mid cursor-pointer"
              onClick={togglePasswordCheckVisibility}
            />
          )}
        </div>

        {/* 비밀번호 안내/에러 문구 */}
        {errors.password ? (
          <p className="typo-h3 text-red-500">
            * 8 ~ 16자 이내 영문, 숫자, 특수문자를 모두 포함하여 입력해주세요.
          </p>
        ) : errors.passwordCheck ? (
          <p className="typo-h3 text-red-500">{errors.passwordCheck.message}</p>
        ) : touchedFields.password || touchedFields.passwordCheck ? null : (
          <p className="typo-h3 text-color-mid">
            * 8 ~ 16자 이내 영문, 숫자, 특수문자를 모두 포함하여 입력해주세요.
          </p>
        )}
      </div>

      {/* 닉네임 */}
      <div className="w-full flex flex-col gap-4">
        <p className="typo-h2 text-color-highest">닉네임</p>

        <input
          {...register("nickname")}
          type="text"
          autoComplete="off"
          className={`w-full h-[65px] p-5 rounded-xl border-2 typo-h2
            text-color-highest placeholder:text-color-low outline-none
            focus:border-brand-blue-400
            ${errors.nickname ? "border-border-accent" : "border-border-mid"}`}
          placeholder="닉네임 (2~10자 이내 한글, 영어, 숫자, -, _ 중에 작성해주세요.)"
          onBlur={handleNicknameBlur}
        />
        {errors.nickname && (
          <p className="typo-body2 text-red-500">{errors.nickname.message}</p>
        )}
      </div>

      {/* 등록 버튼 */}
      {/* 등록하기 버튼을 누르면 이메일 인증 메일이 가는 API롤 호출 */}
      <BtnBasic
        onClick={onClick}
        className="w-full h-[65px]"
        variant="blue"
        disabled={!isValid} // ✅ 유효하지 않으면 비활성화
      >
        <p className="typo-h3-semibold text-color-highest">정보 입력</p>
      </BtnBasic>
    </div>
  );
};

export default SignupStep2;
