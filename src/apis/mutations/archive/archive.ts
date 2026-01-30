import axiosInstance from "@/apis/axios";
import type { ArchiveLikeResponse, ArchiveResponse, CreateArchiveRequest, UpdateArchiveRequest } from "@/types/archive";

export const CreateArchive = async (data: CreateArchiveRequest): Promise<ArchiveResponse> => {
  const response = await axiosInstance.post<ArchiveResponse>(
    "/api/v1/archives",
    data
  );
  return response.data;
};

export const UpdateArchive = async(
  archiveId: number,
  data: UpdateArchiveRequest
): Promise<ArchiveResponse> => {
  const response = await axiosInstance.patch<ArchiveResponse>(
    `/api/v1/archives/${archiveId}`,
    data
  );
  return response.data;
};

export const DeleteArchive = async(
  archiveId: number
): Promise<void> => {
  await axiosInstance.delete(`/api/v1/archives/${archiveId}`);
};

export const LikeArchive = async(
  archiveId: number
): Promise<ArchiveLikeResponse> => {
  const response = await axiosInstance.post<ArchiveLikeResponse>(
    `/api/v1/archives/${archiveId}/like`
  );
  return response.data;
};
