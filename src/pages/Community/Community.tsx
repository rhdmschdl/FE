import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPosts,
  // mapCategoryToServer,
} from "@/apis/queries/community/getPost";
import type { PostItem } from "@/apis/queries/community/getPost";
import { mapCategoryToLabel } from "@/utils/categoryMapper";
import { Pencil } from "lucide-react";
import CommunityTab from "@/components/community/CommunityTab";
import CommunityCard from "@/components/community/CommunityCard";
import Pagination from "@/components/common/Pagination";
import { BtnIcon } from "@/components/common/Button/Btn";
import SelectBox from "@/components/common/Button/SelectBox";
import type { Sort } from "@/enums/sort";

type ListOption = { label: string; value: string };

const LIST_OPTIONS: ListOption[] = [
  { label: "최신 순", value: "newest" },
  { label: "조회수 순", value: "popular" },
  { label: "좋아요 순", value: "like" },
];

const Community = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "like">("newest");
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(9);

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const tabValueForUi = category ?? "ALL";
  const handleTabChange = (v: string) => {
    setCategory(v === "ALL" ? undefined : v);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPosts({ page, size, category, sortBy });
      setPosts(res.content ?? []);
      setTotalPages(res.page?.totalPages ?? 1);
      setTotalItems(res.page?.totalElements ?? res.content?.length ?? 0);
    } catch (err) {
      console.error("getPosts error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // category 또는 sortBy 변경 시 페이지는 1로 맞추고 로드
    setPage(1);
  }, [category, sortBy]);

  useEffect(() => {
    load();
  }, [page, category, sortBy]);

  const handlePageChange = (p: number) => {
    if (p <= 0) setPage(1);
    else setPage(p);
  };

  const handleShare = useCallback(async (postId: number | string) => {
    const url = `${window.location.origin}/community/${postId}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      window.alert("URL을 복사했습니다.");
    } catch (err) {
      console.error("복사 실패:", err);
      window.alert("URL 복사에 실패했습니다.");
    }
  }, []);

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
              options={LIST_OPTIONS}
              value={sortBy as Sort}
              onChange={(v) => setSortBy(v as any)}
            />
          </div>
          <div className="mt-5 mb-15">
            <div className="w-310">
              {loading ? (
                <div className="min-h-[480px] flex items-center justify-center typo-h2 text-color-low">
                  로딩 중...
                </div>
              ) : error ? (
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
