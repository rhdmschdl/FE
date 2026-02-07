import { GetArchiveFeed } from "@/apis/queries/archive/getArchive";
import type { SelectBoxOption } from "@/components/common/Button/SelectBox";
import SelectBox from "@/components/common/Button/SelectBox";
import Pagination from "@/components/common/Pagination";
import FeedCard from "@/components/feed/FeedCard";
import { Sort } from "@/enums/sort";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FEED_OPTIONS: SelectBoxOption<Sort>[] = [
  { label: "최신순", value: Sort.CREATED_AT },
  { label: "조회수 순", value: Sort.VIEW_COUNT },
  { label: "좋아요 순", value: Sort.LIKE_COUNT },
];

const Feed = () => {
  const [sort, setSort] = useState<Sort>(Sort.CREATED_AT);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  // const navigate = useNavigate();

  // isLoading, isError 사용 안 함 -> 추후 스켈레톤으로 처리
  const { data: feedData } = useQuery({
    queryKey: ["feed", page, pageSize, sort],
    queryFn: () => GetArchiveFeed({
      page: page - 1,
      size: pageSize,
      sort,
      direction: "DESC",
    }),
  });

  const feed = feedData?.content ?? [];

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center my-15">
      <div className="max-w-[1920px] mx-auto mb-[60px]">
        {/* SelectBox를 오른쪽으로 정렬 */}
        <div className="w-310 flex justify-end mb-[40px]">
          <SelectBox
            options={FEED_OPTIONS}
            value={sort}
            onChange={(value: Sort) => {
              setSort(value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-310 flex flex-wrap gap-x-[80px] gap-y-[60px]">
          {feed.map((feed) => (
            <FeedCard
              key={feed.archiveId}
              id={feed.archiveId}
              image={feed.thumbnailUrl}
              title={feed.title}
              onClick={() => {
                navigate(`/feed/${feed.archiveId}`);
              }}
            />
          ))}
        </div>
      </div>
      <Pagination
        className="w-310 flex justify-center items-center mx-auto"
        totalItems={feedData?.page.totalElements ?? 0}
        pageSize={pageSize}
        currentPage={page}
        visiblePages={5}
        onChange={(nextPage) => {
          setPage(nextPage);
        }}
      />
    </div>
  );
};

export default Feed;