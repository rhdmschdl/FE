import axiosInstance from "@/apis/axios";

export type ToggleLikeResponse = {
  postId: number | string;
  likeCount: number;
  liked: boolean;
  isLiked?: boolean;
};

export const togglePostLike = async (
  postId: string | number
): Promise<ToggleLikeResponse> => {
  const res = await axiosInstance.post<ToggleLikeResponse>(
    `/api/v1/posts/${postId}/like`
  );
  return res.data;
};

export default togglePostLike;
