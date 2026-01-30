import axiosInstance from "@/apis/axios";

import type { AxiosError } from "axios";
import { MediaRole } from "@/enums/mediaRole";

export type CreatePostFile = {
  fileId: number | string;
  mediaRole: MediaRole | string;
  sequence?: number;
};

export type CreatePostPayload = {
  title: string;
  content: string;
  category: string;
  files?: CreatePostFile[];
};

export type CreatePostResponse = {
  id: number;
  title: string;
  content: string;
  category: string;
  files?: any[];
};

export const createCommunityPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse> => {
  try {
    const res = await axiosInstance.post<CreatePostResponse>(
      "/api/v1/posts",
      payload
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      // 서버에서 온 응답이 있는 경우
      const status = error.response.status;
      const message =
        (error.response.data as any)?.message ||
        (error.response.data as any)?.error ||
        "게시글 생성 중 서버 오류가 발생했습니다.";
      // 간단한 분기
      if (status === 400) {
        throw new Error(message);
      }
      if (status === 401) {
        throw new Error("인증이 필요합니다. 로그인 후 다시 시도해 주세요.");
      }
      if (status === 403) {
        throw new Error("권한이 없습니다.");
      }
      throw new Error(message);
    }
    // 네트워크 오류 등
    throw new Error(error.message || "네트워크 오류가 발생했습니다.");
  }
};

export default createCommunityPost;
