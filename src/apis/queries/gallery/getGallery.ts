import axiosInstance from "@/apis/axios";
import type { DefaultPaginationResponse } from "@/types/pagination";

export type GalleryItemDto = {
  id: number | string;
  thumbnailUrl?: string | null;
  originalUrl?: string;
  fileName?: string;
  createdAt?: string;
  lastModifiedAt?: string;
};

export type GalleryListResponse = {
  title?: string;
  content: GalleryItemDto[];
  page: DefaultPaginationResponse;
};

export type FetchGalleryParams = {
  archiveId: string | number;
  page?: number; // 0-based
  size?: number;
  sort?: string;
  direction?: "ASC" | "DESC";
};

const DEFAULTS = {
  page: 0,
  size: 9,
  sort: "createdAt",
  direction: "DESC",
};

export async function fetchGallery(
  params: FetchGalleryParams,
  signal?: AbortSignal
): Promise<GalleryListResponse> {
  const {
    archiveId,
    page = DEFAULTS.page,
    size = DEFAULTS.size,
    sort = DEFAULTS.sort,
    direction = DEFAULTS.direction,
  } = params;

  const url = `/api/v1/gallery/${archiveId}?page=${page}&size=${size}&sort=${encodeURIComponent(
    sort
  )}&direction=${encodeURIComponent(direction)}`;

  const res = await axiosInstance.get<GalleryListResponse>(url, {
    headers: { Accept: "application/json" },
    signal,
  });

  return res.data;
}

export default fetchGallery;
