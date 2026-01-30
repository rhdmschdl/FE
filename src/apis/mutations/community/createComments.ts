import axiosInstance from "@/apis/axios";
import type { AxiosResponse } from "axios";

export type CreateCommentRequest = {
  postId: number | string;
  content: string;
  parentId?: number | null; // null이면 원댓글
};

export type CreateCommentResponseDto = {
  commentId: number | string;
  content: string;
  userId?: number | string;
  nickname?: string;
  createdAt?: string;
  parentId?: number | string | null;
};

export async function createCommentApi(
  payload: CreateCommentRequest
): Promise<CreateCommentResponseDto> {
  const res: AxiosResponse<CreateCommentResponseDto> = await axiosInstance.post(
    "/api/v1/comments",
    payload
  );
  return res.data;
}

export default createCommentApi;
