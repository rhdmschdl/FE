import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSendFriend,
  deleteCancelFriend,
} from "@/apis/mutations/friend/deleteFriend";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  DeleteSendFriendRequest,
  DeleteSendFriendResponse,
  DeleteCancelFriendRequest,
  DeleteCancelFriendResponse,
} from "@/types/friend";

export const useDeleteSendFriend = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteSendFriendResponse,
    ApiError<ApiErrorBody>,
    DeleteSendFriendRequest
  >({
    mutationFn: (data) => deleteSendFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCancelFriend = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteCancelFriendResponse,
    ApiError<ApiErrorBody>,
    DeleteCancelFriendRequest
  >({
    mutationFn: (data) => deleteCancelFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
