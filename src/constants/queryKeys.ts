export const queryKeys = {
  archive: {
    all: ["archive"] as const,
    detail: (archiveId: number) => ["archive", archiveId] as const,
  },
  ticket: {
    all: ["ticket"] as const,
    detail: (ticketId: number) => ["ticket", ticketId] as const,
  },
  ticketBook: {
    all: ["ticketBook"] as const,
    detail: (ticketBookId: number) => ["ticketBook", ticketBookId] as const,
  },
  diary: {
    all: ["diary"] as const,
    detail: (diaryId: number) => ["diary", diaryId] as const,
  },
  diaryBook: {
    all: ["diaryBook"] as const,
    detail: (archiveId: number) => ["diaryBook", archiveId] as const,
  },
  gallery: {
    all: ["gallery"] as const,
    list: (archiveId: number) => ["gallery", archiveId] as const,
  },
  friend: {
    all: ["friend"] as const,
    status: (friendId: number) => ["friend", "status", friendId] as const,
    sendList: (type: string) => ["friend", "sendList", type] as const,
    list: () => ["friend", "list"] as const,
  },
  user: {
    all: ["user"] as const,
    me: () => ["user", "me"] as const,
    detail: (userId: number) => ["user", "detail", userId] as const,
  },
  repost: {
    all: ["repost"] as const,
    list: (archiveId: string | number) => ["repost", archiveId] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (params: { page?: number; size?: number; category?: string; sortBy?: string }) =>
      ["posts", "list", params] as const,
    detail: (postId: number | string) => ["posts", "detail", postId] as const,
  },
} as const;
