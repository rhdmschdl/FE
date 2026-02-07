import { useNavigate } from "react-router-dom";
import ArchiveHeader from "@/components/archive/ArchiveHeader";
import ButtonLike from "@/components/archive/ButtonLike";
import DiaryList from "@/components/archive/List/DiaryList";
import GalleryList from "@/components/archive/List/GalleryList";
import RepostList from "@/components/archive/List/RepostList";
import TicketList from "@/components/archive/List/TicketList";
import Calendar from "@/components/calendar/Calendar";
import Banner from "@/components/community/Banner";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetArchiveDetail } from "@/apis/queries/archive/getArchive";
import {
  DeleteArchive,
  LikeArchive,
  UpdateArchive,
} from "@/apis/mutations/archive/archive";
import { Visibility, type ArchiveResponse, type UpdateArchiveRequest } from "@/types/archive";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuthStore } from "@/store/useAuthStore";
import { MediaRole } from "@/enums/mediaRole";
import { useRef, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const ArchiveDetail = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const urlParams = useParams();
  const archiveId = urlParams.archiveId;
  const archiveIdNum = Number(archiveId);
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // 월별 라벨 조회

  const uploadInProgressRef = useRef(false);

  // 아카이브 상세 조회
  const { data: archive } = useQuery({
    queryKey: ["archive", archiveIdNum],
    queryFn: () => GetArchiveDetail(archiveIdNum),
    retry: false,
  });
  console.log("archive", archive);

  // 아카이브 업데이트
  const updateArchiveMutation = useMutation({
    mutationFn: (data: UpdateArchiveRequest) =>
      UpdateArchive(Number(archiveId), data),
    onSuccess: (updatedArchive) => {
      queryClient.setQueryData(["archive", archiveIdNum], updatedArchive);

      uploadInProgressRef.current = false;
    },
    onError: () => {
      uploadInProgressRef.current = false;
    },
  });

  // 아카이브 삭제
  const deleteArchiveMutation = useMutation({
    mutationFn: () => DeleteArchive(archiveIdNum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive", archiveIdNum] });
      queryClient.invalidateQueries({ queryKey: ["archives"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["myArchives"], exact: false });
      navigate("/archive");
    },
    onError: (error) => {
      console.error("아카이브 삭제 실패:", error);
      alert("아카이브 삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 아카이브 좋아요
  const likeArchiveMutation = useMutation({
    mutationFn: () => LikeArchive(archiveIdNum),
    onSuccess: (likedArchive) => {
      // 기존 데이터를 가져와서 좋아요 정보만 업데이트
      queryClient.setQueryData<ArchiveResponse>(["archive", archiveIdNum], (oldData) => {
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

  const { upload } = useFileUpload({
    onSuccess: (response) => {
      if (uploadInProgressRef.current || !response?.fileId) return;

      uploadInProgressRef.current = true;
      updateArchiveMutation.mutate({
        title: null,
        visibility: null,
        bannerImageId: response.fileId,
      });
    },
    onError: (error) => {
      console.error("배너 이미지 업로드 실패:", error);
      alert("배너 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      uploadInProgressRef.current = false;
    },
  });
  const handleTitleSave = (title: string) => {
    updateArchiveMutation.mutate({
      title: title ?? null,
      visibility: null,
      bannerImageId: null,
    });
  };
  // 배너 저장 핸들러 (파일 업로드 시작)
  const handleBannerSave = async (file: File) => {
    // 이미 업로드 중이면 무시
    if (uploadInProgressRef.current) {
      console.log("이미 업로드 중입니다.");
      return;
    }
    try {
      await upload({
        file,
        mediaRole: MediaRole.CONTENT,
      });
    } catch (error) {
      console.error("배너 업로드 시작 실패:", error);
      uploadInProgressRef.current = false;
    }
  };
  // 공개 기준 저장 핸들러
  const handleVisibilitySave = (visibility: Visibility) => {
    updateArchiveMutation.mutate({
      visibility: visibility,
      bannerImageId: null,
      title: null,
    });
  };

  // 삭제버튼 클릭 시 모달 오픈
  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  // 모달 오픈 시 모달 취소 버튼
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  // 아카이브 삭제 핸들러
  const handleDeleteArchive = () => {
    deleteArchiveMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Banner
        image={archive?.bannerUrl}
        isEdit={archive?.isOwner}
        onBannerSave={handleBannerSave}
      />
      {/* 배너 밑부분 */}
      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-[60px] gap-[60px]">
        <div className="w-310">
          {/* 아카이브 헤더 */}
          <ArchiveHeader
            isFeed={false}
            onTitleSave={(title) => {
              handleTitleSave(title);
            }}
            createdAt={archive?.createdAt}
            title={archive?.title}
            ownerNickname={archive?.ownerNickname}
            badge={archive?.badge}
            isMenu={true}
            onVisibilitySave={handleVisibilitySave}
            visibility={archive?.visibility}
            onDeleteArchive={handleDeleteModalOpen}
            onClickProfile={() => {
              if (archive?.createdBy === currentUser?.id) {
                navigate(`/mypage`);
                return;
              }
              navigate(`/profile/${archive?.createdBy}`);
            }}
          />
          {/* 아카이브 달력 */}
          <Calendar
            archiveId={archiveIdNum}
            // labelData={monthlyEvents}
            // stickerData={monthlyStickers}
            mode="interactive"
          />
          <div className="flex flex-col items-start justify-between gap-[60px] my-[60px]">
            {/* 덕질 일기 */}
            <DiaryList archiveId={archiveId} limit={3} isOwner={archive?.createdBy === currentUser?.id} />
            {/* 덕질 갤러리 */}
            <GalleryList
              archiveId={archiveId}
              limit={3}
              isOwner={archive?.createdBy === currentUser?.id}
            />
            {/* 티켓북 */}
            <TicketList
              archiveId={archiveId}
              limit={3}
              isOwner={archive?.createdBy === currentUser?.id}
            />
            {/* 덕질 리포스트 */}
            <RepostList
              archiveId={archiveId}
              limit={3}
              isOwner={archive?.createdBy === currentUser?.id}
            />
          </div>
          {/* 좋아요 */}
          <ButtonLike
            liked={archive?.isLiked}
            likeCount={archive?.likeCount}
            onClick={() => {
              if (archive?.createdBy === currentUser?.id) {
                alert("본인의 아카이브에는 좋아요를 누를 수 없습니다.");
                return;
              }
              likeArchiveMutation.mutate();
              console.log("좋아요 클릭");
            }}
          // disabled={archive?.createdBy === currentUser?.id}
          />
        </div>
      </div>
      <ConfirmModal
        trigger={<></>}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="아카이브 삭제"
        description="아카이브와 내부에 포함된 모든 데이터가 영구 삭제됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmVariant="blue"
        onConfirm={handleDeleteArchive}
        onCancel={handleDeleteModalClose}
      />
    </div>
  );
};

export default ArchiveDetail;