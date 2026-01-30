import axiosInstance from "@/apis/axios";
import { Sort } from "@/enums/sort";
import type { ArchiveResponse, GetArchiveRequest, GetArchiveResponse,  } from "@/types/archive";

// 사용자의 아카이브 목록 조회
export const GetUserArchive = async (userId: number, params: GetArchiveRequest): Promise<GetArchiveResponse> => {
  const response = await axiosInstance.get(`/api/v1/archives/users/${userId}`, {
    params: {
      page: params?.page ?? 0, // default 0
      size: params?.size ?? 10, // default 10
      sort: params?.sort ?? Sort.CREATED_AT,      // default "createdAt"
      direction: params?.direction ?? "DESC", // default "DESC"
    },
  });
  return response.data;
};

// 아카이브 상세 조회
export const GetArchiveDetail = async (archiveId: number): Promise<ArchiveResponse> => {
  const response = await axiosInstance.get(`/api/v1/archives/${archiveId}`);
  return response.data;
}

// 전역 아카이브 피드 조회 -> 공개된 아카이브 조회 (피드 페이지에서 사용)
export const GetArchiveFeed = async (params: GetArchiveRequest): Promise<GetArchiveResponse> => {
  const response = await axiosInstance.get(`/api/v1/archives/feed`, {
    params: {
      page: params?.page ?? 0, // default 0
      size: params?.size ?? 10, // default 10
      sort: params?.sort ?? Sort.CREATED_AT,      // default "createdAt"
      direction: params?.direction ?? "DESC", // default "DESC"
    },
  });
  return response.data;
}