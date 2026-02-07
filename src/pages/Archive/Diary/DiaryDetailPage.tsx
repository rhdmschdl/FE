import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetDiary } from "@/apis/queries/diary/useGetDiary";
import { useUpdateDiary } from "@/apis/mutations/diary/usePatchDiary";
import { useDeleteDiary } from "@/apis/mutations/diary/useDeleteDiary";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuthStore } from "@/store/useAuthStore";
import { Visibility } from "@/enums/visibilty";
import { MediaRole } from "@/enums/mediaRole";
import { DEFAULT_DIARY_COLOR, getDiaryBgColor } from "@/constants/diaryColors";
import { useDiaryColorStore } from "@/store/useDiaryColorStore";
import ColorChange from "@/components/common/ColorChange";
import DiaryImage from "@/components/diary/DiaryImage";
import DatePicker from "@/components/ticket/DatePicker";
import DiaryText from "@/components/diary/DiaryText";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import { DiaryFooter } from "@/components/diary/DiaryFooter";
import ConfirmModal from "@/components/common/ConfirmModal";
import DiaryDetailSkeleton from "@/components/diary/DiaryDetailSkeleton";
import dayjs from "dayjs";

type UploadedImage = {
  id: string;
  fileId: number;
  previewUrl: string;
  isExisting?: boolean;
};

const DiaryDetailPage = () => {
  const { archiveId, diaryId } = useParams();
  const navigate = useNavigate();

  // 현재 로그인된 사용자 정보
  const currentUser = useAuthStore((state) => state.user);

  // 전역 색상 상태
  const { setColor: setGlobalColor, resetColor } = useDiaryColorStore();

  // 페이지 벗어날 때 색상 초기화
  useEffect(() => {
    return () => resetColor();
  }, [resetColor]);

  // API 훅
  const { data: diary, isLoading } = useGetDiary({ diaryId: Number(diaryId) });
  const { mutate: updateDiary, isPending: isUpdating } = useUpdateDiary();
  const { mutate: deleteDiary, isPending: isDeleting } = useDeleteDiary();
  const { uploadFiles, isUploading } = useFileUpload();

  // 작성자 여부 확인 - 본인만 수정/삭제 가능
  const isOwner = currentUser?.id === diary?.createdBy;

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recordedAt, setRecordedAt] = useState("");
  const [color, setColor] = useState(DEFAULT_DIARY_COLOR);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [images, setImages] = useState<UploadedImage[]>([]);

  // 삭제 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (diary) {
      setTitle(diary.title);
      setContent(diary.content);
      setRecordedAt(diary.recordedAt);
      setColor(diary.color);
      setGlobalColor(diary.color);
      setVisibility(diary.visibility);

      // 기존 이미지 변환
      const existingImages: UploadedImage[] = diary.files.map((file) => ({
        id: `existing-${file.fileId}`,
        fileId: file.fileId,
        previewUrl: file.cdnUrl,
        isExisting: true,
      }));
      setImages(existingImages);
    }
  }, [diary, setGlobalColor]);

  const isFormValid =
    title.trim() !== "" && content.trim() !== "" && recordedAt !== "";

  // 이미지 추가 - 선택 즉시 일괄 업로드 (최대 3장)
  const handleImageAdd = async (files: File[]) => {
    const maxCount = 3;
    const remaining = maxCount - images.length;
    if (remaining <= 0) return;

    const filesToUpload = files.slice(0, remaining);

    const newImages = filesToUpload.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      fileId: 0,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
    }));
    setImages((prev) => [...prev, ...newImages]);

    const uploadResult = await uploadFiles({
      files: filesToUpload,
      mediaRole: MediaRole.CONTENT,
    });

    if (uploadResult) {
      // 업로드 성공 시 fileId 업데이트
      setImages((prev) => {
        const updated = [...prev];
        newImages.forEach((img, index) => {
          const target = updated.find((i) => i.id === img.id);
          if (target && uploadResult[index]) {
            target.fileId = uploadResult[index].fileId;
          }
        });
        return updated;
      });
    } else {
      // 업로드 실패 시 제거
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setImages((prev) =>
        prev.filter((img) => !newImages.some((n) => n.id === img.id))
      );
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  // 이미지 삭제
  const handleImageDelete = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target && !target.isExisting) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 편집 모드 진입
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    // 원래 데이터로 복원
    if (diary) {
      setTitle(diary.title);
      setContent(diary.content);
      setRecordedAt(diary.recordedAt);
      setColor(diary.color);
      setGlobalColor(diary.color);
      setVisibility(diary.visibility);

      // 새로 추가한 이미지의 URL 해제
      images.forEach((img) => {
        if (!img.isExisting) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });

      // 기존 이미지로 복원
      const existingImages: UploadedImage[] = diary.files.map((file) => ({
        id: `existing-${file.fileId}`,
        fileId: file.fileId,
        previewUrl: file.cdnUrl,
        isExisting: true,
      }));
      setImages(existingImages);
    }
  };

  // 저장
  const handleSave = () => {
    if (!diaryId || isUpdating) return;

    const files = images
      .filter((img) => img.fileId > 0)
      .map((img, index) => ({
        fileId: img.fileId,
        mediaRole: MediaRole.CONTENT,
        sequence: index,
      }));

    updateDiary(
      {
        diaryId: Number(diaryId),
        title,
        content,
        recordedAt,
        color,
        visibility,
        files,
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
        },
      }
    );
  };

  // 삭제
  const handleDelete = () => {
    if (!diaryId || isDeleting) return;

    deleteDiary(
      { diaryId: Number(diaryId) },
      {
        onSuccess: () => {
          navigate(`/archive/${archiveId}/diary`);
        },
      }
    );
  };

  if (isLoading) {
    return <DiaryDetailSkeleton />;
  }

  if (!diary) {
    return (
      <div className="w-full h-full bg-[#EEF7FC] flex items-center justify-center">
        <p>일기를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 표시할 색상: 편집 모드면 color state, 아니면 diary.color
  const displayColor = isEditMode ? color : diary.color;

  return (
    <div
      className="w-full min-w-310 h-full"
      style={{ backgroundColor: getDiaryBgColor(displayColor) }}
    >
      <div className="flex flex-col items-center justify-center max-w-[1920px] mx-auto py-15 gap-15">
        {/* 색상 선택 - 소유자 & 편집 모드에서만 */}
        <div className="w-310 flex justify-start">
          {isOwner && isEditMode && (
            <ColorChange
              initialColor={{ color }}
              onColorChange={(c) => {
                const newColor = c?.color || DEFAULT_DIARY_COLOR;
                setColor(newColor);
                setGlobalColor(newColor);
              }}
              className="font-hakgyoansim-b"
            />
          )}
        </div>

        {/* 이미지 첨부 영역 */}
        <div className="w-full">
          <DiaryImage
            images={images}
            onImageAdd={handleImageAdd}
            onImageDelete={handleImageDelete}
            isEditMode={!isOwner || !isEditMode}
            color={displayColor}
          />
        </div>

        {/* 날짜 선택 및 일기 내용 */}
        <div className="w-310 flex flex-col gap-15">
          <div className="flex gap-5 items-center w-full">
            <p className="text-center typo-h1 font-hakgyoansim-b text-color-high">날짜 : </p>
            {isOwner && isEditMode ? (
              <DatePicker
                value={recordedAt}
                onChange={(date) => setRecordedAt(date || "")}
                placeholder="날짜 입력"
                className="flex-1 w-50 justify-center items-center"
              />
            ) : (
              <p className="text-center text-[40px] font-hakgyoansim-l text-color-high">
                {dayjs(recordedAt).format("YYYY.MM.DD")}
              </p>
            )}
          </div>

          <DiaryText
            title={title}
            onTitleChange={(t) => setTitle(t || "")}
            content={content}
            onContentChange={(c) => setContent(c || "")}
            isEditable={isOwner && isEditMode}
            color={displayColor}
          />
        </div>

        {/* 비공개 체크박스 - 소유자 & 편집 모드에서만 */}
        {isOwner && isEditMode && (
          <div className="w-310 flex items-center justify-end gap-3">
            <div
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                setVisibility((prev) =>
                  prev === Visibility.PRIVATE
                    ? Visibility.PUBLIC
                    : Visibility.PRIVATE
                );
              }}
            >
              <CheckboxIcon
                size={24}
                checked={visibility === Visibility.PRIVATE}
              />
            </div>
            <p className="typo-body1 text-color-highest text-center">비공개</p>
          </div>
        )}
      </div>

      <ConfirmModal
        trigger={<></>}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="해당 일기장을 삭제하시겠어요?"
        confirmLabel="확인"
        cancelLabel="취소"
        confirmVariant="blue"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {isOwner ? (
        <DiaryFooter
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onDelete={() => setDeleteModalOpen(true)}
          isEdit={!isEditMode}
          isDisabled={!isFormValid || isUploading}
          color={displayColor}
        />
      ) : (
        <DiaryFooter noBtn color={displayColor} />
      )}
    </div>
  );
};

export default DiaryDetailPage;
