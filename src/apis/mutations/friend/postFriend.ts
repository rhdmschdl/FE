import axiosInstance from "@/apis/axios";
import type {
  PostAcceptFriendRequest,
  PostAcceptFriendResponse,
  PostRecoverFriendRequest,
  PostRecoverFriendResponse,
  PostRejectFriendRequest,
  PostRejectFriendResponse,
  PostSendFriendRequest,
  PostSendFriendResponse,
} from "@/types/friend";

export const postRejectFriend = async (
  data: PostRejectFriendRequest
): Promise<PostRejectFriendResponse> => {
  const { friendId, ...body } = data;
  const response = await axiosInstance.post<PostRejectFriendResponse>(
    `/api/v1/friends/${friendId}/reject`,
    body
  );
  return response.data;
};

export const postRecoverFriend = async (
  data: PostRecoverFriendRequest
): Promise<PostRecoverFriendResponse> => {
  const { friendId, ...body } = data;
  const response = await axiosInstance.post<PostRecoverFriendResponse>(
    `/api/v1/friends/${friendId}/recover`,
    body
  );
  return response.data;
};

export const postAcceptFriend = async (
  data: PostAcceptFriendRequest
): Promise<PostAcceptFriendResponse> => {
  const { friendId, ...body } = data;
  const response = await axiosInstance.post<PostAcceptFriendResponse>(
    `/api/v1/friends/${friendId}/accept`,
    body
  );
  return response.data;
};

export const postSendFriend = async (
  data: PostSendFriendRequest
): Promise<PostSendFriendResponse> => {
  const { friendId, ...body } = data;
  const response = await axiosInstance.post<PostSendFriendResponse>(
    `/api/v1/friends/request/${friendId}`,
    body
  );
  return response.data;
};
