import axiosInstance from "@/apis/axios";
import type {
  DeleteSendFriendRequest,
  DeleteSendFriendResponse,
  DeleteCancelFriendRequest,
  DeleteCancelFriendResponse,
} from "@/types/friend";

export const deleteSendFriend = async (
  data: DeleteSendFriendRequest
): Promise<DeleteSendFriendResponse> => {
  const { friendId } = data;
  const response = await axiosInstance.delete<DeleteSendFriendResponse>(
    `/api/v1/friends/request/${friendId}`
  );
  return response.data;
};

export const deleteCancelFriend = async (
  data: DeleteCancelFriendRequest
): Promise<DeleteCancelFriendResponse> => {
  const { friendId } = data;
  const response = await axiosInstance.delete<DeleteCancelFriendResponse>(
    `/api/v1/friends/${friendId}/cancel`
  );
  return response.data;
};
