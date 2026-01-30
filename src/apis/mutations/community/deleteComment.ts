import axiosInstance from "@/apis/axios";
import type { AxiosResponse } from "axios";

export type DeleteCommentResponse = {
  success?: boolean;
};

export async function deleteCommentApi(
  commentId: number | string
): Promise<DeleteCommentResponse> {
  const res: AxiosResponse<DeleteCommentResponse> = await axiosInstance.delete(
    `/api/v1/comments/${commentId}`
  );
  return res.data;
}

export default deleteCommentApi;
