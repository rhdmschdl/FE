import type { Sort } from "@/enums/sort";
import type { DefaultPaginationResponse } from "./pagination";

export enum Visibility {
  PUBLIC = "PUBLIC",
  RESTRICTED = "RESTRICTED",
  PRIVATE = "PRIVATE",
}

export enum Badge {
  NEWBIE = "NEWBIE",
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
  MASTER = "MASTER",
}

export type Archive = {
  archiveId: number;
  userId: number;
  title: string;
  bannerUrl: string;
  image: string;
}

export type ArchiveResponse = {
  id: number;
  title: string;
  visibility: Visibility;
  badge: Badge;
  bannerUrl: string;
  viewCount: number;
  likeCount: number;
  ownerNickname: string;
  createdAt: string;
  owner: boolean;
  liked: boolean;
  isLiked: boolean;
  isOwner: boolean;
}

export type CreateArchiveRequest = {
  title: string;
  visibility: Visibility;
  bannerImageId: number | null;
}

export type GetArchiveRequest = {
  page?: number;
  size?: number;
  sort?: Sort;
  direction?: "ASC"|"DESC"|"asc"|"desc";  
}

export type ArchiveListItem = {
  archiveId: number;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  hotScore: number;
  visibility: Visibility;
  createdAt: string;
  lastModifiedAt: string;
  ownerNickname: string;
};

export type GetArchiveResponse = {
  title: string;
  content: ArchiveListItem[];
  page: DefaultPaginationResponse;
};

export type UpdateArchiveRequest = {
  title: string | null;
  visibility: Visibility | null;
  bannerImageId: number | null;
}

export type ArchiveLikeResponse = {
  archiveId: number;
  likeCount: number;
  liked: boolean | null;
  isLiked: boolean | null;
}