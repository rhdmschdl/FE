import { FriendTabId } from "@/enums/friendTabId";

export const FRIEND_TABS: {
  id: FriendTabId;
  title: string;
  label: string;
  emptyMessage: string;
}[] = [
  {
    id: FriendTabId.REQUESTS,
    title: "친구 요청",
    label: "친구 요청 목록",
    emptyMessage: "받은 친구 요청이 없습니다.",
  },
  {
    id: FriendTabId.FRIENDS,
    title: "친구 목록",
    label: "친구 목록",
    emptyMessage: "친구가 없습니다.",
  },
  {
    id: FriendTabId.PENDING,
    title: "요청 목록",
    label: "요청 목록",
    emptyMessage: "친구 요청한 내역이 없습니다.",
  },
];
