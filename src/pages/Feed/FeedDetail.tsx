import { useNavigate } from "react-router-dom";
import Banner from "@/components/community/Banner";
import { useParams } from "react-router-dom";
import ArchiveHeader from "@/components/archive/ArchiveHeader";
import Calendar from "@/components/calendar/Calendar";
import DiaryList from "@/components/archive/List/DiaryList";
import GalleryList from "@/components/archive/List/GalleryList";
import TicketList from "@/components/archive/List/TicketList";
import RepostList from "@/components/archive/List/RepostList";
import ButtonLike from "@/components/archive/ButtonLike";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetArchiveDetail } from "@/apis/queries/archive/getArchive";
import { LikeArchive } from "@/apis/mutations/archive/archive";
import type { ArchiveResponse } from "@/types/archive";
import { useAuthStore } from "@/store/useAuthStore";

const FeedDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = useParams();
  const archiveId = urlParams.id;

  const userId = useAuthStore((state) => state.user?.id);

  const { data: feed } = useQuery({
    queryKey: ["feed", archiveId],
    queryFn: () => GetArchiveDetail(Number(archiveId)),
  });

  const likeArchiveMutation = useMutation({
    mutationFn: () => LikeArchive(Number(archiveId)),
    onSuccess: (likedArchive) => {
      queryClient.setQueryData<ArchiveResponse>(["feed", archiveId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          likeCount: likedArchive.likeCount,
          isLiked: likedArchive.isLiked ?? likedArchive.liked ?? false,
          liked: likedArchive.liked ?? likedArchive.isLiked ?? false,
        };
      });
    },
    onError: (error) => {
      console.error("좋아요 실패:", error);
      alert("좋아요에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <Banner image={feed?.bannerUrl ?? ""} />
      {/* 배너 밑부분 */}
      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-[60px] gap-[60px]">
        {/* 아카이브 헤더 */}
        <ArchiveHeader
          title={feed?.title}
          ownerNickname={feed?.ownerNickname}
          badge={feed?.badge}
          createdAt={feed?.createdAt}
          isFeed={true}
          onClickProfile={() => {
            if (feed?.createdBy === userId) {
              navigate(`/mypage`);
              return;
            }
            navigate(`/profile/${feed?.createdBy}`);
            return;
          }}
        />
        {/* 아카이브 달력 */}
        <Calendar
          // labelData={monthlyEvents}
          // stickerData={monthlyStickers}
          archiveId={Number(archiveId)}
          mode="readonly"
        />
        {/* 덕질 일기 */}
        <DiaryList
          archiveId={archiveId}
          limit={3}
          isOwner={false}
          emptyDescription="아직 작성된 일기가 없어요."
        />
        {/* 덕질 갤러리 */}
        <GalleryList
          archiveId={archiveId}
          limit={3}
          isOwner={false}
          emptyDescription="아직 작성된 갤러리가 없어요."
        />
        {/* 티켓북 */}
        <TicketList
          archiveId={archiveId}
          limit={3}
          isOwner={false}
          emptyDescription="아직 작성된 티켓북이 없어요."
        />
        {/* 덕질 리포스트 */}
        <RepostList
          archiveId={archiveId}
          limit={3}
          isOwner={false}
          emptyDescription="아직 작성된 리포스트가 없어요."
        />
        {/* 좋아요 */}
        <ButtonLike
          liked={feed?.isLiked}
          likeCount={feed?.likeCount ?? 0}
          onClick={() => {
            if (feed?.createdBy === userId) {
              alert("본인의 피드에는 좋아요를 누를 수 없습니다.");
              return;
            }
            likeArchiveMutation.mutate();
            console.log("좋아요 클릭");
          }}
        />
      </div>
    </div>
  );
};

export default FeedDetail;