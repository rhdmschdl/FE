import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postRejectFriend,
  postRecoverFriend,
  postAcceptFriend,
  postSendFriend,
} from "@/apis/mutations/friend/postFriend";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  PostRejectFriendRequest,
  PostRejectFriendResponse,
  PostRecoverFriendRequest,
  PostRecoverFriendResponse,
  PostAcceptFriendRequest,
  PostAcceptFriendResponse,
  PostSendFriendRequest,
  PostSendFriendResponse,
} from "@/types/friend";

export const usePostRejectFriend = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostRejectFriendResponse,
    ApiError<ApiErrorBody>,
    PostRejectFriendRequest
  >({
    mutationFn: (data) => postRejectFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const usePostRecoverFriend = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostRecoverFriendResponse,
    ApiError<ApiErrorBody>,
    PostRecoverFriendRequest
  >({
    mutationFn: (data) => postRecoverFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const usePostAcceptFriend = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostAcceptFriendResponse,
    ApiError<ApiErrorBody>,
    PostAcceptFriendRequest
  >({
    mutationFn: (data) => postAcceptFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

type UsePostSendFriendOptions = {
  onSuccess?: () => void;
  onError?: (error: ApiError<ApiErrorBody>) => void;
};

export const usePostSendFriend = (options: UsePostSendFriendOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    PostSendFriendResponse,
    ApiError<ApiErrorBody>,
    PostSendFriendRequest
  >({
    mutationFn: (data) => postSendFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });
      options.onSuccess?.();
    },
    onError: (error) => {
      console.error("친구 요청 실패:", error);
      options.onError?.(error);
    },
  });
};
