import { useState } from "react";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EmptyFeedList from "@/components/feed/EmptyFeedList";
import DiaryCard from "@/components/common/Card/DiaryCard";
import { BtnIcon } from "@/components/common/Button/Btn";
import Pagination from "@/components/common/Pagination";
import EditableTitle from "@/components/common/EditableTitle";
import DiaryPageSkeleton from "@/components/diary/DiaryPageSkeleton";
import { useGetDiaryBook } from "@/apis/queries/diary/useGetDiary";
import { useUpdateDiaryBook } from "@/apis/mutations/diary/usePatchDiary";
import { useDeleteDiary } from "@/apis/mutations/diary/useDeleteDiary";
import { useGetArchive } from "@/apis/queries/archive/useGetArchive";
import { Pencil, Plus, X, Trash2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const DiaryPage = () => {
  const params = useParams();
  const archiveId = Number(params.archiveId);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDiaryIds, setSelectedDiaryIds] = useState<number[]>([]);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 9;

  // 아카이브 상세 조회 (소유자 여부 확인용)
  const { data: archive } = useGetArchive({ archiveId });
  const isOwner = archive?.isOwner ?? false;

  const { data, isLoading } = useGetDiaryBook({
    archiveId,
    page: page - 1,
    size: pageSize,
  });

  // 다이어리북 이름 수정
  const { mutate: updateDiaryBookName } = useUpdateDiaryBook();

  // 다이어리 삭제
  const { mutateAsync: deleteDiaryAsync } = useDeleteDiary();

  const diaryList = data?.content ?? [];
  const totalItems = data?.page?.totalElements ?? 0;
  const diaryBookTitle = data?.title ?? "덕질 일기";

  // 다이어리북 이름 저장
  const handleSaveName = (nextName: string) => {
    updateDiaryBookName({
      archiveId,
      title: nextName,
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setSelectedDiaryIds([]);
  };

  const handleDiarySelect = (diaryId: number) => {
    setSelectedDiaryIds((prev) =>
      prev.includes(diaryId)
        ? prev.filter((id) => id !== diaryId)
        : [...prev, diaryId]
    );
  };

  const handleDelete = async () => {
    if (selectedDiaryIds.length === 0) return;

    try {
      // 선택된 다이어리 삭제
      await Promise.all(
        selectedDiaryIds.map((diaryId) => deleteDiaryAsync({ diaryId }))
      );

      // 삭제 후 현재 페이지가 유효한지 체크
      const newTotal = totalItems - selectedDiaryIds.length;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
      if (page > newTotalPages) {
        setSearchParams({ page: "1" });
      }

      // 삭제 후 편집 모드 종료
      setIsEditMode(false);
      setSelectedDiaryIds([]);
    } catch (error) {
      console.error("다이어리 삭제 실패:", error);
    }
  };

  if (isLoading) {
    return <DiaryPageSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-15 gap-15">
        <div className="w-310 flex flex-col gap-15">
          <EditableTitle
            value={diaryBookTitle}
            onSave={handleSaveName}
            placeholder="다이어리북명을 입력하세요."
            maxLength={50}
            editable={isOwner}
          />

          {diaryList.length > 0 ? (
            <div className="w-full flex flex-col gap-10">
              {/* 버튼 영역 - 소유자만 표시 */}
              {isOwner && (
                <div className="w-full flex justify-end gap-4">
                  {isEditMode ? (
                    <>
                      <BtnIcon
                        startIcon={
                          <Trash2 className="w-6 h-6 text-color-high" />
                        }
                        onClick={handleDelete}
                        disabled={selectedDiaryIds.length === 0}
                      >
                        삭제하기
                      </BtnIcon>
                      <BtnIcon
                        startIcon={<X className="w-6 h-6 text-color-high" />}
                        onClick={handleCancel}
                      >
                        취소하기
                      </BtnIcon>
                    </>
                  ) : (
                    <>
                      <BtnIcon
                        startIcon={<Plus className="w-6 h-6 text-color-high" />}
                        onClick={() => {
                          navigate(`/archive/${archiveId}/diary/new`);
                        }}
                      >
                        일기 추가
                      </BtnIcon>
                      <BtnIcon
                        startIcon={
                          <Pencil className="w-6 h-6 text-color-high" />
                        }
                        onClick={handleEditToggle}
                      >
                        편집 하기
                      </BtnIcon>
                    </>
                  )}
                </div>
              )}

              {/* DiaryCard 목록 */}
              <div className="w-full">
                <div className="grid grid-cols-3 gap-20">
                  {diaryList.map((diary) => (
                    <DiaryCard
                      key={diary.diaryId}
                      archiveId={archiveId}
                      diaryId={diary.diaryId}
                      title={diary.title}
                      image={diary.thumbnailUrl ?? undefined}
                      date={diary.recordedAt}
                      isEditMode={isEditMode}
                      isSelected={selectedDiaryIds.includes(diary.diaryId)}
                      onSelect={() => handleDiarySelect(diary.diaryId)}
                      onClick={() =>
                        navigate(`/archive/${archiveId}/diary/${diary.diaryId}`)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* 페이지네이션 */}
              {totalItems && (
                <div className="flex justify-center pt-5 pb-15">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    visiblePages={5}
                    currentPage={page}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : isOwner ? (
            <EmptyList
              title="일기 추가"
              description="아직 작성된 일기가 없어요."
              className="w-full h-135"
              onClick={() => {
                navigate(`/archive/${archiveId}/diary/new`);
              }}
            />
          ) : (
            <EmptyFeedList description="아직 작성된 일기가 없어요." />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
