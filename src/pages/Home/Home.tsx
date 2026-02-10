import { CreateArchive } from "@/apis/mutations/archive/archive";
import { GetArchiveFeed, GetUserArchive } from "@/apis/queries/archive/getArchive";
import { useGetPosts } from "@/apis/queries/community/useGetPosts";
import ArchiveCard from "@/components/archive/ArchiveCard";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import CommunityCard from "@/components/community/CommunityCard";
import FeedCard from "@/components/feed/FeedCard";
import { Sort } from "@/enums/sort";
import { CommunitySortBy } from "@/enums/communitySortBy";
import { Visibility, type CreateArchiveRequest } from "@/types/archive";
import { mapCategoryToLabel } from "@/utils/categoryMapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SHARE_BASE_URL } from "@/constants/urls";
import { useClipboard } from "@/hooks/useClipboard";
import { useAuthStore } from "@/store/useAuthStore";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const createArchiveMutation = useMutation({
    mutationFn: (data: CreateArchiveRequest) => CreateArchive(data),
    onSuccess: (data) => {
      console.log("createArchive success");
      navigate(`/archive/${data.id}`);
    },
    onError: (error) => {
      console.log("createArchive error", error);
      alert("아카이브 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // ✅ 1. 내 아카이브 조회 쿼리 추가
  const { data: myArchiveData } = useQuery({
    queryKey: ["myArchive", currentUser?.id],
    queryFn: () => GetUserArchive(currentUser!.id, { page: 0, size: 2 }), // 최대 2개만 가져옴
    enabled: !!currentUser, // 로그인 했을 때만 실행
  });

  // ✅ 2. 핫피드 쿼리 수정 (size 3 -> 5)
  const { data: hotArchiveData } = useQuery({
    queryKey: ["hotArchive"],
    queryFn: () =>
      GetArchiveFeed({
        page: 0,
        size: 5, // 5개 가져오기 (1~3위: 하단용, 4~5위: 상단 추천용)
        sort: Sort.HOT_SCORE,
        direction: "DESC",
      }),
  });

  const handleCreateArchive = () => {
    createArchiveMutation.mutate({
      title: "아카이브명",
      visibility: Visibility.PUBLIC,
      bannerImageId: null,
    });
  };
  const { data: hotFeedData } = useQuery({
    queryKey: ["hotFeed"],
    queryFn: () =>
      GetArchiveFeed({
        page: 0,
        size: 3,
        sort: Sort.HOT_SCORE,
        direction: "DESC",
      }),
  });
  const { data: hotCommunityData } = useGetPosts({
    page: 1,
    size: 3,
    sortBy: CommunitySortBy.HOT_SCORE,
  });

  const { copy } = useClipboard({
    successMessage: "공유 URL이 클립보드에 복사되었습니다.",
    errorMessage: "URL 복사에 실패했습니다. 다시 시도해 주세요.",
  });

  const handleShare = (postId: number | string) => {
    const id = encodeURIComponent(String(postId));
    const url = `${SHARE_BASE_URL}/${id}`;
    copy(url);
  };

  const hotFeed = hotFeedData?.content ?? [];
  const hotArchive = hotArchiveData?.content ?? [];
  const myArchive = myArchiveData?.content ?? [];
  // ✅ 3. 보여줄 데이터 결정 로직
  // 로그인하지 않았거나 내 아카이브가 없으면 -> 핫피드 4,5위 사용
  const isMyArchiveEmpty = !currentUser || myArchive.length === 0;

  const displayArchives = isMyArchiveEmpty
    ? hotArchive.slice(3, 5) // 4, 5위 데이터 (index 3, 4)
    : myArchive;

  return (
    <div className="flex flex-col items-center justify-center my-15">
      <div className="max-w-[1920px] mx-auto flex flex-col items-center gap-[60px]">
        <div className="w-310">
          <div className="flex flex-col items-center justify-between gap-[60px] my-[60px]">
            {/* 아카이브 만들기 */}
            <ArchiveTitle
              title="아카이브 만들기"
              isEditable={false}
              onClick={() => {
                navigate("/archive");
              }}
            />
            <div className="w-full flex gap-20 ">
              <ArchiveCard
                title="덕카이브 만들기"
                image={undefined}
                isCreateMode={true}
                onClick={() => {
                  handleCreateArchive();
                }}
              />
              {/* ✅ 조건부 데이터 렌더링 */}
              {displayArchives.map((archive) => (
                <ArchiveCard
                  key={archive.archiveId}
                  archiveId={archive.archiveId}
                  image={archive.thumbnailUrl} // API 응답 필드명 확인 (thumbnailUrl 사용)
                  isEditMode={false}
                  title={archive.title}
                  onClick={() => {
                    // ✅ 클릭 시 이동 경로 분기 처리
                    if (isMyArchiveEmpty) {
                      // 추천(남의 것)이면 피드 상세로 이동
                      navigate(`/archive/${archive.archiveId}`);
                    } else {
                      // 내 것이면 아카이브 상세로 이동
                      navigate(`/archive/${archive.archiveId}`);
                    }
                  }}
                />
              ))}
            </div>

            {/* 지금 핫한 피드 */}
            <ArchiveTitle
              title="지금 핫한 피드"
              isEditable={false}
              onClick={() => {
                navigate("/feed");
              }}
            />
            <div className="w-full flex gap-20 ">
              {hotFeed.map((hotFeed) => (
                <FeedCard
                  key={hotFeed.archiveId}
                  id={hotFeed.archiveId}
                  image={hotFeed.thumbnailUrl}
                  title={hotFeed.title}
                  onClick={() => {
                    navigate(`/feed/${hotFeed.archiveId}`);
                    console.log(hotFeed.archiveId + "번 피드 클릭");
                  }}
                />
              ))}
            </div>
            {/* 지금 핫한 커뮤니티 게시글 */}
            <ArchiveTitle
              title="지금 핫한 커뮤니티 게시글"
              isEditable={false}
              onClick={() => {
                navigate("/community");
              }}
            />
            <div className="w-full flex gap-20 ">
              {hotCommunityData?.content.map((hotCommunity) => (
                <CommunityCard
                  key={hotCommunity.postId}
                  title={hotCommunity.title}
                  img={hotCommunity.thumbnailUrl ?? undefined}
                  categoryLabel={
                    mapCategoryToLabel(hotCommunity.category) ??
                    hotCommunity.category
                  }
                  categoryValue={hotCommunity.category}
                  content={hotCommunity.summary ?? "게시글 내용"}
                  onClick={() => {
                    navigate(`/community/${hotCommunity.postId}`);
                  }}
                  onClickShare={() => handleShare(hotCommunity.postId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
