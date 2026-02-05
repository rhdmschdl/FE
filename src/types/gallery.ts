import type { DefaultPaginationResponse } from "@/types/pagination";

// 갤러리 아이템
export type GalleryItem = {
  id: number | string;
  thumbnailUrl?: string | null;
  originalUrl?: string | null;
  fileName?: string;
  createdAt?: string;
  lastModifiedAt?: string;
};

// GET /api/v1/gallery/{archiveId}
export type GetGalleryRequest = {
  archiveId: string | number;
  page?: number;
  size?: number;
  sort?: string;
  direction?: "ASC" | "DESC";
};

export type GetGalleryResponse = {
  title?: string;
  content: GalleryItem[];
  page: DefaultPaginationResponse;
};

// POST /api/v1/gallery/{archiveId}
export type AddGalleryRequest = {
  archiveId: string | number;
  fileIds: number[];
};

export type AddGalleryResponse = {
  createdCount?: number;
  archiveId?: number;
};

// PATCH /api/v1/gallery/{archiveId}
export type UpdateGalleryRequest = {
  archiveId: string | number;
  title: string;
};

export type UpdateGalleryResponse = void;

// DELETE /api/v1/gallery/{archiveId}
export type DeleteGalleryRequest = {
  archiveId: string | number;
  galleryIds: number[];
};

export type DeleteGalleryResponse = void;
