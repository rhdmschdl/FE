import { useState, useCallback } from "react";
import { initialte, complete, abort } from "@/apis/mutations/file/postFile";
import { uploadPart } from "@/apis/mutations/file/uploadPart";
import { UploadStatus } from "@/enums/uploadStatus";
import type { MimeType } from "@/enums/mimeType";
import type {
  FileInitiateResponse,
  FileCompleteResponse,
  Part,
  UploadProgress,
  UseFileUploadOptions,
  UploadFileParams,
  UploadFilesParams,
} from "@/types/file";

/**
 * S3 멀티파트 업로드 훅
 *
 * 흐름: initiate → uploadPart (파트별 업로드) → complete
 * 에러 발생 시: abort 호출
 */
export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { onProgress, onSuccess, onError } = options;

  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    currentPart: 0,
    totalParts: 0,
  });
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<FileCompleteResponse | null>(null);

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [currentUploadInfo, setCurrentUploadInfo] = useState<{
    key: string;
    uploadId: string;
  } | null>(null);

  const reset = useCallback(() => {
    setStatus(UploadStatus.IDLE);
    setProgress({
      loaded: 0,
      total: 0,
      percentage: 0,
      currentPart: 0,
      totalParts: 0,
    });
    setError(null);
    setData(null);
    setAbortController(null);
    setCurrentUploadInfo(null);
  }, []);

  const abortUpload = useCallback(async () => {
    if (currentUploadInfo) {
      try {
        await abort({
          key: currentUploadInfo.key,
          uploadId: currentUploadInfo.uploadId,
        });
      } catch (e) {
        console.error("업로드 중단 실패:", e);
      }
    }
    setStatus(UploadStatus.ABORTED);
  }, [currentUploadInfo]);

  // 단일 파일 업로드
  const upload = useCallback(
    async (params: UploadFileParams): Promise<FileCompleteResponse | null> => {
      const { file, mediaRole, sequence = 0 } = params;

      const controller = new AbortController();
      setAbortController(controller);
      setError(null);
      setData(null);

      try {
        // 1. initiate: presigned URLs 받기
        setStatus(UploadStatus.INITIATING);

        const initiateResponse: FileInitiateResponse = await initialte({
          originalFileName: file.name,
          mimeType: file.type as MimeType,
          fileSize: file.size,
          mediaRole,
        });

        setCurrentUploadInfo({
          key: initiateResponse.key,
          uploadId: initiateResponse.uploadId,
        });

        // 2. uploadPart: 파일 분할 후 각 presigned URL로 업로드
        setStatus(UploadStatus.UPLOADING);

        const { partPresignedUrls, key, uploadId } = initiateResponse;
        const totalParts = partPresignedUrls.length;
        const parts: Part[] = [];

        let totalLoaded = 0;
        let currentPartLoaded = 0;

        setProgress({
          loaded: 0,
          total: file.size,
          percentage: 0,
          currentPart: 0,
          totalParts,
        });

        for (let i = 0; i < partPresignedUrls.length; i++) {
          if (controller.signal.aborted) {
            throw new Error("업로드 취소됨");
          }

          const { partNumber, presignedUrl, contentLength } =
            partPresignedUrls[i];

          const start = i * contentLength;
          const end = Math.min(start + contentLength, file.size);
          const chunk = file.slice(start, end);

          currentPartLoaded = 0;

          const { etag } = await uploadPart({
            presignedUrl,
            chunk,
            onProgress: (loaded) => {
              currentPartLoaded = loaded;
              const currentTotal = totalLoaded + currentPartLoaded;
              const percentage = Math.round((currentTotal / file.size) * 100);

              const newProgress: UploadProgress = {
                loaded: currentTotal,
                total: file.size,
                percentage,
                currentPart: i + 1,
                totalParts,
              };

              setProgress(newProgress);
              onProgress?.(newProgress);
            },
          });

          totalLoaded += chunk.size;
          parts.push({ partNumber, etag });
        }

        // 3. complete: 업로드 완료 처리 → CDN URL 반환
        setStatus(UploadStatus.COMPLETING);

        const completeResponse: FileCompleteResponse = await complete({
          key,
          uploadId,
          parts,
          originalFileName: file.name,
          fileSize: file.size,
          mimeType: file.type as MimeType,
          mediaRole,
          sequence,
        });

        setStatus(UploadStatus.SUCCESS);
        setData(completeResponse);
        setCurrentUploadInfo(null);
        onSuccess?.(completeResponse);

        return completeResponse;
      } catch (e) {
        const uploadError =
          e instanceof Error ? e : new Error("알 수 없는 업로드 오류");

        if (uploadError.message !== "업로드 취소됨") {
          setError(uploadError);
          setStatus(UploadStatus.ERROR);
          onError?.(uploadError);

          // 에러 발생 시 abort 호출
          if (currentUploadInfo) {
            try {
              await abort({
                key: currentUploadInfo.key,
                uploadId: currentUploadInfo.uploadId,
              });
            } catch (abortError) {
              console.error("에러 후 업로드 중단 실패:", abortError);
            }
          }
        }

        return null;
      }
    },
    [onProgress, onSuccess, onError, currentUploadInfo]
  );

  const cancel = useCallback(() => {
    abortController?.abort();
    abortUpload();
  }, [abortController, abortUpload]);

  // 다중 파일 업로드
  const uploadFiles = useCallback(
    async (
      params: UploadFilesParams
    ): Promise<FileCompleteResponse[] | null> => {
      const { files, mediaRole } = params;

      const promises = files.map((file, i) =>
        upload({ file, mediaRole, sequence: i })
      );

      const results = await Promise.all(promises);

      if (results.some((r) => r === null)) {
        return null;
      }

      return results as FileCompleteResponse[];
    },
    [upload]
  );

  // 이 훅은 파일 업로드 관련 함수 (upload, uploadFiles, cancel, reset),
  // 업로드 상태 (status, progress, error, data),
  // 그리고 편의를 위한 boolean 상태값 (isIdle, isUploading, isSuccess, isError)을 반환합니다.
  // upload와 uploadFiles 함수는 각각 단일 파일과 다중 파일 업로드를 처리합니다. 다른 것은 확장 기능이라 UI에서 없다면 이것만 사용해도 무방합니다.
  return {
    upload,
    uploadFiles,
    cancel,
    reset,
    status,
    progress,
    error,
    data,
    isIdle: status === UploadStatus.IDLE,
    isUploading:
      status === UploadStatus.INITIATING ||
      status === UploadStatus.UPLOADING ||
      status === UploadStatus.COMPLETING,
    isSuccess: status === UploadStatus.SUCCESS,
    isError: status === UploadStatus.ERROR,
  };
};
