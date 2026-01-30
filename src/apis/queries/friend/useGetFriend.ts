import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getFriendList,
  getSendFriendList,
  getStatusFriend,
} from "@/apis/queries/friend/getFriend";
import { queryKeys } from "@/constants/queryKeys";
import type { FriendRequestType } from "@/enums/friendRequestType";
import type {
  GetFriendListRequest,
  GetFriendListResponse,
  GetSendFriendListRequest,
  GetSendFriendListResponse,
  GetStatusFriendRequest,
  GetStatusFriendResponse,
} from "@/types/friend";

export const useGetFriendList = (params: GetFriendListRequest) => {
  return useQuery<GetFriendListResponse>({
    queryKey: queryKeys.friend.list(),
    queryFn: () => getFriendList(params),
    retry: false,
  });
};

export const useGetStatusFriend = (
  params: GetStatusFriendRequest & { refetchInterval?: number }
) => {
  const { refetchInterval, ...queryParams } = params;
  return useQuery<GetStatusFriendResponse>({
    queryKey: queryKeys.friend.status(queryParams.friendId),
    queryFn: () => getStatusFriend(queryParams),
    enabled: !!queryParams.friendId,
    retry: false,
    refetchInterval,
  });
};

export const useGetSendFriendList = (params: GetSendFriendListRequest) => {
  return useQuery<GetSendFriendListResponse>({
    queryKey: queryKeys.friend.sendList(params.type),
    queryFn: () => getSendFriendList(params),
    retry: false,
  });
};

export const useGetFriendListInfinite = (params: {
  size?: number;
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { refetchInterval, enabled = true, ...queryParams } = params;
  return useInfiniteQuery<GetFriendListResponse>({
    queryKey: ["friend", "list", "infinite"],
    queryFn: ({ pageParam }) => {
      const { lastFriendId, lastAcceptedAt } = pageParam as {
        lastFriendId?: number;
        lastAcceptedAt?: string;
      };
      return getFriendList({ ...queryParams, lastFriendId, lastAcceptedAt });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || lastPage.content.length === 0) return undefined;
      const lastFriend = lastPage.content[lastPage.content.length - 1];
      return {
        lastFriendId: lastFriend.userId,
        lastAcceptedAt: lastFriend.acceptedAt,
      };
    },
    retry: false,
    refetchInterval,
    enabled,
  });
};

export const useGetSendFriendListInfinite = (params: {
  type: FriendRequestType;
  size?: number;
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { refetchInterval, enabled = true, ...queryParams } = params;
  return useInfiniteQuery<GetSendFriendListResponse>({
    queryKey: ["friend", "sendList", "infinite", queryParams.type],
    queryFn: ({ pageParam }) => {
      const { lastId, lastCreatedAt } = pageParam as {
        lastId?: number;
        lastCreatedAt?: string;
      };
      return getSendFriendList({ ...queryParams, lastId, lastCreatedAt });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || lastPage.content.length === 0) return undefined;
      const lastItem = lastPage.content[lastPage.content.length - 1];
      return {
        lastId: lastItem.requestId,
        lastCreatedAt: lastItem.createdAt,
      };
    },
    retry: false,
    refetchInterval,
    enabled,
  });
};
