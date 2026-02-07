import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetPosts } from "@/apis/queries/community/useGetPosts";
import { mapCategoryToLabel } from "@/utils/categoryMapper";
import { Pencil } from "lucide-react";
import CommunityTab from "@/components/community/CommunityTab";
import CommunityCard from "@/components/community/CommunityCard";
import CommunityListSkeleton from "@/components/community/CommunityListSkeleton";
import Pagination from "@/components/common/Pagination";
import { BtnIcon } from "@/components/common/Button/Btn";
import SelectBox from "@/components/common/Button/SelectBox";
import { SORT_OPTIONS } from "@/constants/community";
import { SHARE_BASE_URL } from "@/constants/urls";
import { CommunitySortBy } from "@/enums/communitySortBy";
import { useClipboard } from "@/hooks/useClipboard";

const Community = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const sortBy = (searchParams.get("sortBy") as CommunitySortBy) || CommunitySortBy.NEWEST;
  const page = Number(searchParams.get("page")) || 1;
  const size = 9;

  const { data, isLoading, isError } = useGetPosts({ page, size, category, sortBy });

  const posts = data?.content ?? [];
  const totalItems = data?.page?.totalElements ?? 0;

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const tabValueForUi = category ?? "ALL";
  const handleTabChange = (v: string) => {
    updateSearchParams({
      category: v === "ALL" ? undefined : v,
      page: "1",
    });
  };

  const handlePageChange = (p: number) => {
    const newPage = p <= 0 ? 1 : p;
    updateSearchParams({ page: String(newPage) });
  };

  const handleSortChange = (v: CommunitySortBy) => {
    updateSearchParams({ sortBy: v, page: "1" });
  };

  const { copy } = useClipboard({
    successMessage: "공유 URL이 클립보드에 복사되었습니다.",
    errorMessage: "URL 복사에 실패했습니다. 다시 시도해 주세요.",
  });

  const handleShare = (postId: number | string) => {
    const id = encodeURIComponent(String(postId));
    const url = `${SHARE_BASE_URL}/${id}`;
    copy(url);
  };

  return (
    <div>
      <div className="py-15 flex justify-center items-center">
        <CommunityTab value={tabValueForUi} onChange={handleTabChange} />
      </div>
      <div className="flex justify-center">
        <div className="max-w-310">
          <div className="flex flex-row gap-5 justify-end">
            <BtnIcon
              onClick={() => navigate("/community/new")}
              startIcon={
                <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
              }
            >
              글쓰기
            </BtnIcon>
            <SelectBox
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>
          <div className="mt-5 mb-15">
            <div className="w-310">
              {isLoading ? (
                <CommunityListSkeleton count={size} />
              ) : isError ? (
                <div className="min-h-[480px] flex items-center justify-center typo-h2 text-color-low">
                  게시물을 불러오지 못했습니다.
                </div>
              ) : totalItems === 0 ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center justify-center"
                  style={{ minHeight: "480px" }}
                >
                  <p className="text-center typo-h2 text-color-low">
                    새로운 덕질 이야기를 기다리고 있어요.
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-3 gap-x-20 gap-y-8"
                  style={{
                    gridTemplateColumns: "repeat(3, 360px)",
                    rowGap: "32px",
                  }}
                >
                  {posts.map((post) => (
                    <CommunityCard
                      key={post.postId}
                      title={post.title}
                      categoryLabel={
                        mapCategoryToLabel(post.category) ?? post.category
                      }
                      categoryValue={post.category}
                      content={post.summary ?? ""}
                      img={post.thumbnailUrl ?? undefined}
                      onClick={() => navigate(`/community/${post.postId}`)}
                      onClickShare={() => handleShare(post.postId)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {totalItems > 0 && (
        <div className="flex justify-center mb-12">
          <Pagination
            totalItems={totalItems}
            pageSize={size}
            visiblePages={5}
            currentPage={page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Community;
