import { useCallback } from "react";

type CopyOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
};

const defaultOptions: CopyOptions = {
  successMessage: "클립보드에 복사되었습니다.",
  errorMessage: "복사에 실패했습니다. 다시 시도해 주세요.",
};

export const useClipboard = (options: CopyOptions = {}) => {
  const { onSuccess, onError, successMessage, errorMessage } = {
    ...defaultOptions,
    ...options,
  };

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // 폴백: textarea를 만들어 복사
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
          } catch {
            throw new Error("execCommand copy failed");
          }
          document.body.removeChild(textarea);
        }

        if (onSuccess) {
          onSuccess();
        } else if (successMessage) {
          window.alert(successMessage);
        }
      } catch (err) {
        console.error("복사 실패:", err);
        if (onError) {
          onError(err);
        } else if (errorMessage) {
          window.alert(errorMessage);
        }
      }
    },
    [onSuccess, onError, successMessage, errorMessage]
  );

  return { copy };
};
