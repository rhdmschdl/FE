import axiosInstance from "@/apis/axios";
import type {
  GetFriendListRequest,
  GetFriendListResponse,
  GetSendFriendListRequest,
  GetSendFriendListResponse,
  GetStatusFriendRequest,
  GetStatusFriendResponse,
} from "@/types/friend";

export const getFriendList = async (
  data: GetFriendListRequest
): Promise<GetFriendListResponse> => {
  const { lastFriendId, lastAcceptedAt, size } = data;
  const response = await axiosInstance.get<GetFriendListResponse>(
    `/api/v1/friends`,
    {
      params: { lastFriendId, lastAcceptedAt, size },
    }
  );
  return response.data;
};

export const getStatusFriend = async (
  data: GetStatusFriendRequest
): Promise<GetStatusFriendResponse> => {
  const { friendId } = data;
  const response = await axiosInstance.get<GetStatusFriendResponse>(
    `/api/v1/friends/${friendId}/status`
  );
  return response.data;
};

export const getSendFriendList = async (
  data: GetSendFriendListRequest
): Promise<GetSendFriendListResponse> => {
  const { type, lastId, lastCreatedAt, size } = data;
  const response = await axiosInstance.get<GetSendFriendListResponse>(
    `/api/v1/friends/requests`,
    {
      params: { type, lastId, lastCreatedAt, size },
    }
  );
  return response.data;
};
