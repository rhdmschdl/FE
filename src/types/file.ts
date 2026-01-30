import type { MediaRole } from "@/enums/mediaRole";
import type { MediaType } from "@/enums/mediaType";
import type { MimeType } from "@/enums/mimeType";

export type PartPresignedUrl = {
  partNumber: number;
  presignedUrl: string;
  contentLength: number;
};

export type Part = {
  partNumber: number;
  etag: string;
};

// Request
export type FileInitiateRequest = {
  originalFileName: string;
  mimeType: MimeType;
  fileSize: number;
  mediaRole: MediaRole;
};

export type FileCompleteRequest = {
  key: string;
  uploadId: string;
  parts: Part[];
  originalFileName: string;
  fileSize: number;
  mimeType: MimeType;
  mediaRole: MediaRole;
  sequence: number;
};

export type FileAbortRequest = {
  key: string;
  uploadId: string;
};

export type UploadPartRequest = {
  presignedUrl: string;
  chunk: Blob;
  onProgress?: (loaded: number) => void;
};

export type UploadPartResponse = {
  etag: string;
};

// Response
export type FileInitiateResponse = {
  key: string;
  uploadId: string;
  contentType: MimeType;
  partCount: number;
  partPresignedUrls: PartPresignedUrl[];
};

export type FileCompleteResponse = {
  fileId: number;
  filename: string;
  cdnUrl: string;
  fileSize: number;
  mediaType: MediaType;
  mediaRole: MediaRole;
  sequence: number;
};

export type FileAbortResponse = {};

// Upload 양식
export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
  currentPart: number;
  totalParts: number;
};

export type UseFileUploadOptions = {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (response: FileCompleteResponse) => void;
  onError?: (error: Error) => void;
};

export type UploadFileParams = {
  file: File;
  mediaRole: MediaRole;
  sequence?: number;
  onProgress?: (progress: UploadProgress | number) => void;
};

export type UploadFilesParams = {
  files: File[];
  mediaRole: MediaRole;
};
