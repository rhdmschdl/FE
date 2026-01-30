import axiosInstance from "@/apis/axios";
import type { AxiosResponse } from "axios";
import type { DefaultPaginationResponse } from "@/types/pagination";

export type PostItem = {
  postId: number;
  title: string;
  category: string;
  summary?: string | null;
  thumbnailUrl?: string | null;
  writerNickname?: string;
  likeCount?: number;
  viewCount?: number;
  hotScore?: number;
  createdAt?: string;
  lastModifiedAt?: string;
};

export type GetPostsResponse = {
  title?: string;
  content: PostItem[];
  page: DefaultPaginationResponse;
};

type GetPostsOptions = {
  page?: number;
  size?: number;
  category?: string;
  sortBy?: "newest" | "popular" | "like" | "hotScore";
  direction?: "ASC" | "DESC";
};

/* UI 정렬값 -> 서버 sort/direction 매핑 */
function mapSortOption(sortBy?: string) {
  switch (sortBy) {
    case "popular":
      return { sort: "viewCount", direction: "DESC" };
    case "like":
      return { sort: "likeCount", direction: "DESC" };
    case "hotScore":
      return { sort: "hotScore", direction: "DESC" };
    case "newest":
    default:
      return { sort: "createdAt", direction: "DESC" };
  }
}

/* UI 카테고리 키 -> 서버 카테고리 키 매핑 */
export function mapCategoryToServer(category?: string) {
  if (!category || category === "all") return undefined;
  const map: Record<string, string> = {
    idol: "IDOL",
    actor: "ACTOR",
    musician: "MUSICIAN",
    sport: "SPORT",
    artist: "ARTIST",
    animation: "ANIMATION",
    etc: "ETC",
  };
  return map[category] ?? category.toUpperCase();
}

/* API 호출 함수 */
export async function getPosts(
  options: GetPostsOptions = {}
): Promise<GetPostsResponse> {
  const {
    page = 1,
    size = 10,
    category,
    sortBy = "newest",
    direction,
  } = options;

  const serverPage = Math.max(0, (page ?? 1) - 1);
  const mapped = mapSortOption(sortBy);
  const sort = mapped.sort;
  const dir = direction ?? mapped.direction;

  const params: Record<string, any> = {
    page: serverPage,
    size,
    sort,
    direction: dir,
  };

  const serverCategory = mapCategoryToServer(category);
  if (serverCategory !== undefined && serverCategory !== null) {
    params.category = serverCategory;
  }

  try {
    const res: AxiosResponse<GetPostsResponse> = await axiosInstance.get(
      "/api/v1/posts",
      { params }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}
