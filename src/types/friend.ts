import type { FriendStatus } from "@/enums/friendStatus";
import type { FriendRequestType } from "@/enums/friendRequestType";

type FriendId = {
  friendId: number;
};

type DefaultContent = {
  userId: number;
  nickname: string;
};

export type PostRejectFriendRequest = FriendId;
export type PostRejectFriendResponse = void;
export type PostRecoverFriendRequest = FriendId;
export type PostRecoverFriendResponse = void;
export type PostAcceptFriendRequest = FriendId;
export type PostAcceptFriendResponse = void;
export type PostSendFriendRequest = FriendId;
export type PostSendFriendResponse = void;
export type DeleteSendFriendRequest = FriendId;
export type DeleteSendFriendResponse = void;
export type GetFriendListRequest = {
  lastFriendId?: number;
  lastAcceptedAt?: string;
  size?: number;
};
export type GetFriendListResponse = {
  content: (DefaultContent & { acceptedAt: string })[];
  hasNext: boolean;
  pageSize: number;
};
export type GetStatusFriendRequest = FriendId;
export type GetStatusFriendResponse = {
  status: FriendStatus;
};
export type GetSendFriendListRequest = {
  type: FriendRequestType;
  lastId?: number;
  lastCreatedAt?: string;
  size?: number;
};
export type GetSendFriendListResponse = {
  content: (DefaultContent & { requestId: number; createdAt: string })[];
  hasNext: boolean;
  pageSize: number;
};
export type DeleteCancelFriendRequest = FriendId;
export type DeleteCancelFriendResponse = void;
