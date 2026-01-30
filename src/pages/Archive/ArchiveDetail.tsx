import { useNavigate } from "react-router-dom";
import ArchiveHeader from "@/components/archive/ArchiveHeader";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import ButtonLike from "@/components/archive/ButtonLike";
import DiaryList from "@/components/archive/List/DiaryList";
import EmptyList from "@/components/archive/Empty/EmptyList";
import GalleryList from "@/components/archive/List/GalleryList";
import RepostList from "@/components/archive/List/RepostList";
import TicketList from "@/components/archive/List/TicketList";
import Calendar from "@/components/calendar/Calendar";
import Banner from "@/components/community/Banner";
import { archiveDataMock } from "@/mockData/archiveData";
import { Camera, Link } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetArchiveDetail } from "@/apis/queries/archive/getArchive";
import {
  DeleteArchive,
  LikeArchive,
  UpdateArchive,
} from "@/apis/mutations/archive/archive";
import { Visibility, type UpdateArchiveRequest } from "@/types/archive";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MediaRole } from "@/enums/mediaRole";
import { useRef, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getMonthlyEvents, getMonthlyStickers } from "@/apis/queries/calendar/Calendar";

const ArchiveDetail = () => {
  const navigate = useNavigate();

  const urlParams = useParams();
  const archiveId = urlParams.archiveId;
  const archiveIdNum = Number(archiveId);
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // 월별 라벨 조회
  const { data: monthlyEvents } = useQuery({
    queryKey: ["monthlyEvents", archiveIdNum],
    queryFn: () => getMonthlyEvents(archiveIdNum, new Date().getFullYear(), new Date().getMonth() + 1),
  });
  // 월별 스티커 조회
  const { data: monthlyStickers } = useQuery({
    queryKey: ["monthlyStickers", archiveIdNum],
    queryFn: () => getMonthlyStickers(archiveIdNum, new Date().getFullYear(), new Date().getMonth() + 1),
  });


  const uploadInProgressRef = useRef(false);

  // 아카이브 상세 조회
  const { data: archive } = useQuery({
    queryKey: ["archive", archiveIdNum],
    queryFn: () => GetArchiveDetail(archiveIdNum),
    retry: false,
  });

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
      queryClient.setQueryData(["archive", archiveIdNum], likedArchive);
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

  const archivedData = archiveDataMock.find(
    (archived) => archived.archiveId === Number(archiveId)
  );

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
            title={archive?.title}
            ownerNickname={archive?.ownerNickname}
            badge={archive?.badge}
            createdAt={archive?.createdAt}
            isMenu={true}
            onVisibilitySave={handleVisibilitySave}
            visibility={archive?.visibility}
            onDeleteArchive={handleDeleteModalOpen}
          />
          {/* 아카이브 달력 */}
          <Calendar
            archiveId={archiveIdNum}
            labelData={monthlyEvents}
            stickerData={monthlyStickers}
            mode="interactive"
          />
          <div className="flex flex-col items-start justify-between gap-[60px] my-[60px]">
            {/* 덕질 일기 */}
            <DiaryList archiveId={archiveId} limit={3} isOwner={archive?.isOwner} />
            {/* 덕질 갤러리 */}
            <ArchiveTitle
              title="덕질 갤러리"
              onClick={() => {
                if (!archiveId) return;
                navigate(`/archive/${archiveId}/gallery`);
              }}
              isMore={(archivedData?.Gallery?.length ?? 0) > 0}
              isEditable={archive?.isOwner}
            />
            {(archivedData?.Gallery?.length ?? 0 > 0) ? (
              <GalleryList gallery={archivedData?.Gallery} />
            ) : (
              <EmptyList
                title="사진 추가"
                description="사진을 추가해서 덕질 기록을 남겨보세요."
                startIcon={<Camera className="w-6 h-6 text-color-high" />}
                onClick={() => {
                  if (!archiveId) return;
                  navigate(`/archive/${archiveId}/gallery`);
                }}
              />
            )}
            {/* 티켓북 */}
            <TicketList
              archiveId={archiveId}
              limit={3}
              isOwner={archive?.isOwner}
            />
            {/* 덕질 리포스트 */}
            <ArchiveTitle
              title="덕질 리포스트"
              onClick={() => {
                if (!archiveId) return;
                navigate(`/archive/${archiveId}/repost`);
              }}
              isMore={(archivedData?.Repost?.length ?? 0) > 0}
              isEditable={archive?.isOwner}
            />
            {(archivedData?.Repost?.length ?? 0 > 0) ? (
              <RepostList repost={archivedData?.Repost} />
            ) : (
              <EmptyList
                title="링크 첨부"
                description="링크를 모아서 아카이브를 만들어보세요."
                startIcon={<Link className="w-6 h-6 text-color-high" />}
                onClick={() => {
                  if (!archiveId) return;
                  navigate(`/archive/${archiveId}/repost`);
                }}
              />
            )}
          </div>
          {/* 좋아요 */}
          <ButtonLike
            liked={archive?.isLiked}
            likeCount={archive?.likeCount}
            onClick={() => {
              likeArchiveMutation.mutate();
              console.log("좋아요 클릭");
            }}
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
