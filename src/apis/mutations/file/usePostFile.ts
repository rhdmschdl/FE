import { useMutation } from "@tanstack/react-query";
import { initialte, complete, abort } from "@/apis/mutations/file/postFile";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  FileInitiateRequest,
  FileInitiateResponse,
  FileCompleteRequest,
  FileCompleteResponse,
  FileAbortRequest,
  FileAbortResponse,
} from "@/types/file";

export const useUploadFileInitiate = () => {
  return useMutation<
    FileInitiateResponse,
    ApiError<ApiErrorBody>,
    FileInitiateRequest
  >({
    mutationFn: (data) => initialte(data),
    onSuccess: () => {
      // 쿼리 무효화
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUploadFileComplete = () => {
  return useMutation<
    FileCompleteResponse,
    ApiError<ApiErrorBody>,
    FileCompleteRequest
  >({
    mutationFn: (data) => complete(data),
    onSuccess: () => {
      // 쿼리 무효화
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUploadFileAbort = () => {
  return useMutation<
    FileAbortResponse,
    ApiError<ApiErrorBody>,
    FileAbortRequest
  >({
    mutationFn: (data) => abort(data),
    onSuccess: () => {
      // 쿼리 무효화
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
