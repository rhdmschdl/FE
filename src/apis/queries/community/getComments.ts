import axiosInstance from "@/apis/axios";
import type { AxiosResponse } from "axios";

export type ServerCommentDto = {
  commentId: number;
  content: string;
  userId?: number | string;
  nickname?: string;
  createdAt?: string;
  deleted?: boolean;
  children?: any;
};

export type GetCommentsResponse = {
  content: ServerCommentDto[];
  hasNext?: boolean;
  totalCount?: number;
};

export type GetCommentsOptions = {
  page?: number; // 0-based 가능 (서버 스펙에 맞춰 호출)
  size?: number;
  sort?: string;
  lastCommentId?: number | string;
};

export async function fetchPostComments(
  postId: string | number,
  options: GetCommentsOptions = {}
): Promise<GetCommentsResponse> {
  if (!postId) throw new Error("postId is required");

  const { page = 0, size = 20, sort, lastCommentId } = options;

  const params: Record<string, any> = {
    page,
    size,
  };
  if (sort) params.sort = sort;
  if (lastCommentId !== undefined && lastCommentId !== null) {
    params.lastCommentId = lastCommentId;
  }

  try {
    const res: AxiosResponse<GetCommentsResponse> = await axiosInstance.get(
      `/api/v1/posts/${postId}/comments`,
      { params }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}

export default fetchPostComments;
