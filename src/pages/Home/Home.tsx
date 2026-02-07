import { CreateArchive } from "@/apis/mutations/archive/archive";
import { GetArchiveFeed } from "@/apis/queries/archive/getArchive";
import { useGetPosts } from "@/apis/queries/community/useGetPosts";
import ArchiveCard from "@/components/archive/ArchiveCard";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import CommunityCard from "@/components/community/CommunityCard";
import FeedCard from "@/components/feed/FeedCard";
import { Sort } from "@/enums/sort";
import { CommunitySortBy } from "@/enums/communitySortBy";
import { archiveDataMock } from "@/mockData/archiveData";
import { Visibility, type CreateArchiveRequest } from "@/types/archive";
import { mapCategoryToLabel } from "@/utils/categoryMapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SHARE_BASE_URL } from "@/constants/urls";
import { useClipboard } from "@/hooks/useClipboard";

const Home = () => {
  const navigate = useNavigate();

  const sampleArchiveData = archiveDataMock.slice(0, 2);

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
              {sampleArchiveData.map((sampleArchive) => (
                <ArchiveCard
                  key={sampleArchive.archiveId}
                  archiveId={sampleArchive.archiveId}
                  image={sampleArchive.bannerUrl}
                  isEditMode={false}
                  title={sampleArchive.title}
                  onClick={() => {
                    navigate(`/sample-archive/${sampleArchive.archiveId}`);
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
