import axiosInstance from "@/apis/axios";
import type {
  FileInitiateResponse,
  FileInitiateRequest,
  FileCompleteRequest,
  FileCompleteResponse,
  FileAbortRequest,
  FileAbortResponse,
} from "@/types/file";

export const initialte = async (
  data: FileInitiateRequest
): Promise<FileInitiateResponse> => {
  const response = await axiosInstance.post<FileInitiateResponse>(
    "/api/v1/files/multipart/initiate",
    data
  );
  return response.data;
};

export const complete = async (
  data: FileCompleteRequest
): Promise<FileCompleteResponse> => {
  const response = await axiosInstance.post<FileCompleteResponse>(
    "/api/v1/files/multipart/complete",
    data
  );
  return response.data;
};

export const abort = async (
  data: FileAbortRequest
): Promise<FileAbortResponse> => {
  const response = await axiosInstance.post<FileAbortResponse>(
    "/api/v1/files/multipart/abort",
    data
  );
  return response.data;
};
