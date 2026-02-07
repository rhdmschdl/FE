import { CommunitySortBy } from "@/enums/communitySortBy";

export const SORT_OPTIONS = [
  { label: "최신 순", value: CommunitySortBy.NEWEST },
  { label: "조회수 순", value: CommunitySortBy.POPULAR },
  { label: "좋아요 순", value: CommunitySortBy.LIKE },
] as const;
