import {
  useGetFriendListInfinite,
  useGetSendFriendListInfinite,
} from "@/apis/queries/friend/useGetFriend";
import {
  usePostAcceptFriend,
  usePostRejectFriend,
} from "@/apis/mutations/friend/usePostFriend";
import {
  useDeleteSendFriend,
  useDeleteCancelFriend,
} from "@/apis/mutations/friend/useDeleteFriend";
import { FriendRequestType } from "@/enums/friendRequestType";
import { FriendTabId } from "@/enums/friendTabId";

export const useFriendsData = (activeTab: FriendTabId) => {
  const friendsQuery = useGetFriendListInfinite({
    enabled: activeTab === FriendTabId.FRIENDS,
  });
  const requestsQuery = useGetSendFriendListInfinite({
    type: FriendRequestType.RECEIVED,
    enabled: activeTab === FriendTabId.REQUESTS,
  });
  const pendingQuery = useGetSendFriendListInfinite({
    type: FriendRequestType.SENT,
    enabled: activeTab === FriendTabId.PENDING,
  });

  const { mutate: acceptFriend } = usePostAcceptFriend();
  const { mutate: rejectFriend } = usePostRejectFriend();
  const { mutate: cancelSendFriend } = useDeleteSendFriend();
  const { mutate: deleteFriend } = useDeleteCancelFriend();

  const tabDataMap = {
    [FriendTabId.REQUESTS]: {
      data:
        requestsQuery.data?.pages.flatMap((page) =>
          (page.content ?? []).map((item) => ({ ...item, id: item.userId }))
        ) ?? [],
      query: requestsQuery,
      role: "request" as const,
      handlers: {
        onAccept: (id: string) => acceptFriend({ friendId: Number(id) }),
        onDecline: (id: string) => rejectFriend({ friendId: Number(id) }),
      },
    },
    [FriendTabId.FRIENDS]: {
      data:
        friendsQuery.data?.pages.flatMap((page) =>
          (page.content ?? []).map((item) => ({ ...item, id: item.userId }))
        ) ?? [],
      query: friendsQuery,
      role: "friend" as const,
      handlers: {
        onDelete: (id: string) => deleteFriend({ friendId: Number(id) }),
      },
    },
    [FriendTabId.PENDING]: {
      data:
        pendingQuery.data?.pages.flatMap((page) =>
          (page.content ?? []).map((item) => ({ ...item, id: item.userId }))
        ) ?? [],
      query: pendingQuery,
      role: "pending" as const,
      handlers: {
        onDecline: (id: string) => cancelSendFriend({ friendId: Number(id) }),
      },
    },
  };

  return { tabDataMap };
};
