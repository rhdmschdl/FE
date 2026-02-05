export type RepostBookQueryParams = {
  page?: number; // 0-based
  size?: number;
  sort?: string;
  direction?: "ASC" | "DESC";
  tabId?: number | null;
};

export type RepostBookResponse = {
  title?: string;
  tabId?: number;
  tab?: { id: number; title: string; repostBookId?: number }[];
  content?: Array<{
    id: number;
    postId?: number;
    title?: string;
    thumbnailUrl?: string | null;
    repostTabId?: number;
    createdAt?: string;
  }>;
  page?: {
    size?: number;
    pageNumber?: number;
    totalElements?: number;
    totalPages?: number;
    hasPrev?: boolean;
    hasNext?: boolean;
    empty?: boolean;
  };
};

export type UseGetRepostParams = {
  archiveId?: string | number;
  page?: number; // 0-based
  size?: number;
  sort?: string;
  direction?: "ASC" | "DESC";
  tabId?: number | null;
  enabled?: boolean;
};

export type CreateRepostPayload = {
  url: string;
};

export type CreateRepostTabPayload = {
  title?: string;
};

export type UpdateRepostBookTitlePayload = {
  title: string;
};

export type UpdateRepostTabTitlePayload = {
  title: string;
};

export type RepostItem = {
  id: number;
  url: string;
  title?: string;
  thumbnailUrl?: string | null;
  repostTabId?: number;
  status?: "PENDING" | "COMPLETED" | string;
  createdAt?: string;
};

export type DeleteRepostRequest = {
  repostId: string | number;
};

export type DeleteRepostResponse = void;

export type UpdateRepostBookTitleResponse = {
  repostBookId?: number;
  title?: string;
};

// 예: 서버가 수정된 Tab 객체를 반환할 경우
export type UpdateRepostTabTitleResponse = {
  id?: number;
  title?: string;
  repostBookId?: number;
};
