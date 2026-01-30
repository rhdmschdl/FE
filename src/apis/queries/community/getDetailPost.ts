import axiosInstance from "@/apis/axios";

export type PostFileDto = {
  fileId: number;
  filename?: string;
  cdnUrl?: string;
  fileSize?: number;
  mediaType?: "IMAGE" | "VIDEO" | string;
  mediaRole?: string;
  sequence?: number;
};

export type PostDetailDto = {
  id: number | string;
  title: string;
  content: string;
  category: string;
  createdAt?: string;
  lastModifiedAt?: string;
  files?: PostFileDto[];
  likeCount?: number;
  isLiked?: boolean;
};

export const fetchPostDetail = async (
  postId: string | number
): Promise<PostDetailDto> => {
  const res = await axiosInstance.get<PostDetailDto>(`/api/v1/posts/${postId}`);
  return res.data;
};

export default fetchPostDetail;
