import ArchiveHeader from "@/components/archive/ArchiveHeader";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import ButtonLike from "@/components/archive/ButtonLike";
import GalleryList from "@/components/archive/List/GalleryList";
import RepostList from "@/components/archive/List/RepostList";
import Calendar from "@/components/calendar/Calendar";
import Banner from "@/components/community/Banner";
import { archiveDataMock } from "@/mockData/archiveData";
import { useParams } from "react-router-dom";
import { Visibility } from "@/types/archive";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import DiaryCard from "@/components/common/Card/DiaryCard";
import TicketCard from "@/components/common/Card/TicketCard";

const SampleArchiveDetail = () => {
  const urlParams = useParams();
  const archiveId = urlParams.archiveId;
  const archiveIdNum = Number(archiveId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock Data에서 해당 아카이브 찾기
  const initialArchiveData = archiveDataMock.find(
    (archived) => archived.archiveId === archiveIdNum
  );

  // 로컬 상태로 데이터 관리 (수정/좋아요 반영을 위해)
  const [archive, setArchive] = useState(initialArchiveData);

  // 데이터가 없을 경우 처리
  if (!archive) {
    return <div>아카이브를 찾을 수 없습니다.</div>;
  }

  const handleTitleSave = (title: string) => {
    // API 호출 대신 로컬 상태 업데이트
    setArchive((prev) => (prev ? { ...prev, title } : prev));
  };

  const handleVisibilitySave = (visibility: Visibility) => {
    setArchive((prev) => (prev ? { ...prev, visibility } : prev));
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteArchive = () => {
    // API 호출 대신 알림 후 이동
    alert("아카이브가 삭제되었습니다. (Mock)");
  };

  const handleLike = () => {
    setArchive((prev) => {
      if (!prev) return prev;
      const newLiked = !prev.liked;
      return {
        ...prev,
        liked: newLiked,
        likeCount: newLiked ? prev.likeCount + 1 : prev.likeCount - 1,
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Banner
        image={archive.bannerUrl}
        isEdit={true} // 샘플 페이지이므로 항상 수정 가능하게 하거나, 필요시 조건 추가
        onBannerSave={() => {}}
      />
      {/* 배너 밑부분 */}
      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-[60px] gap-[60px]">
        <div className="w-310">
          {/* 아카이브 헤더 */}
          <ArchiveHeader
            isFeed={false}
            onTitleSave={handleTitleSave}
            createdAt={archive.createdAt}
            title={archive.title}
            ownerNickname={archive.ownerNickname}
            badge={archive.badge}
            isMenu={true}
            onVisibilitySave={handleVisibilitySave}
            visibility={archive.visibility as Visibility}
            onDeleteArchive={handleDeleteModalOpen}
          />
          {/* 아카이브 달력 (데이터 없음) */}
          <Calendar archiveId={archiveIdNum} mode="interactive" />
          <div className="flex flex-col items-start justify-between gap-[60px] my-[60px]">
            {/* 덕질 일기 */}
            <ArchiveTitle
              title="덕질 일기"
              onClick={() => {
                alert("일기 샘플 데이터 입니다.");
              }}
              isMore={archive.Diary?.length > 0}
              isEditable={true}
            />

            <div className="w-full flex flex-col items-start gap-[60px]">
              <div className="flex flex-wrap items-start justify-between gap-[80px]">
                {archive.Diary?.slice(0, 3).map((diary) => (
                  <DiaryCard
                    key={diary.id}
                    archiveId={Number(archiveId)}
                    diaryId={diary.id}
                    title={diary.title}
                    image={diary.image ?? undefined}
                    date={diary.date}
                    isEditMode={false}
                    isSelected={false}
                    onSelect={() => {}}
                    onClick={() => {
                      alert("일기 샘플 데이터 입니다.");
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 덕질 갤러리 */}
            <GalleryList archiveId={archiveId} limit={3} isOwner={true} />
            {/* 티켓북 */}
            <ArchiveTitle
              title="티켓북"
              onClick={() => {
                alert("티켓북 샘플 데이터 입니다.");
              }}
              isMore={(archive.Ticket?.length ?? 0) > 0}
              isEditable={true}
            />
            <div className="w-full flex flex-col items-start gap-[60px]">
              <div className="flex items-start justify-between gap-[80px]">
                {archive.Ticket?.slice(0, 3).map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    id={ticket.id}
                    title={ticket.eventName}
                    date={ticket.date}
                    onClick={() => {
                      alert("티켓 샘플 데이터 입니다.");
                    }}
                  />
                ))}
              </div>
            </div>
            {/* 덕질 리포스트 */}
            <RepostList archiveId={archiveId} limit={3} isOwner={true} />
          </div>
          {/* 좋아요 */}
          <ButtonLike
            liked={archive.liked}
            likeCount={archive.likeCount}
            onClick={handleLike}
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

export default SampleArchiveDetail;
