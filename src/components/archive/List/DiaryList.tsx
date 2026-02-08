import { useNavigate } from "react-router-dom";
import DiaryCard from "@/components/common/Card/DiaryCard";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EmptyFeedList from "@/components/feed/EmptyFeedList";
import { useGetDiaryBook } from "@/apis/queries/diary/useGetDiary";

interface DiaryListProps {
  archiveId?: string;
  limit?: number;
  isEditMode?: boolean;
  selectedIds?: number[];
  onSelect?: (diaryId: number) => void;
  isOwner?: boolean;
  emptyDescription?: string;
}

const DiaryList = ({
  archiveId,
  limit = 3,
  isEditMode = false,
  selectedIds = [],
  onSelect,
  isOwner = false,
  emptyDescription = "아직 작성된 일기가 없어요.",
}: DiaryListProps) => {
  const navigate = useNavigate();

  const { data } = useGetDiaryBook({
    archiveId: Number(archiveId),
    page: 0,
    size: limit,
  });

  const diaryList = data?.content ?? [];
  const hasDiary = diaryList.length > 0;

  const handleNavigateToDiary = () => {
    if (!archiveId) return;
    navigate(`/archive/${archiveId}/diary`);
  };

  return (
    <>
      {/* 덕질 일기 */}
      <ArchiveTitle
        title="덕질 일기"
        onClick={handleNavigateToDiary}
        isMore={hasDiary}
      />
      {hasDiary ? (
        <div className="w-full flex flex-col items-start gap-[60px]">
          <div className="flex flex-wrap items-start justify-between gap-[80px]">
            {diaryList.map((diary) => (
              <DiaryCard
                key={diary.diaryId}
                archiveId={Number(archiveId)}
                diaryId={diary.diaryId}
                title={diary.title}
                image={diary.thumbnailUrl ?? undefined}
                date={diary.recordedAt}
                isEditMode={isEditMode}
                isSelected={selectedIds.includes(diary.diaryId)}
                onSelect={() => onSelect?.(diary.diaryId)}
                onClick={() => {
                  if (!isEditMode) {
                    navigate(`/archive/${archiveId}/diary/${diary.diaryId}`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      ) : isOwner ? (
        <EmptyList
          title="일기 추가"
          description={emptyDescription}
          onClick={handleNavigateToDiary}
        />
      ) : (
        <EmptyFeedList description={emptyDescription} />
      )}
    </>
  );
};

export default DiaryList;
