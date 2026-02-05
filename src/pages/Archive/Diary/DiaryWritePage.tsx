import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAddDiary } from "@/apis/mutations/diary/usePostDiary";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGetArchive } from "@/apis/queries/archive/useGetArchive";
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

type UploadedImage = {
  id: string;
  fileId: number;
  previewUrl: string;
};

const DiaryWritePage = () => {
  const { archiveId } = useParams();
  const navigate = useNavigate();

  // 아카이브 상세 조회 (소유자 여부 확인용)
  const { data: archive, isLoading: isArchiveLoading } = useGetArchive({
    archiveId: Number(archiveId),
  });

  const { mutate: addDiary, isPending } = useAddDiary();
  const { uploadFiles, isUploading } = useFileUpload();

  // 전역 색상 상태
  const { color, setColor, resetColor } = useDiaryColorStore();

  // 페이지 벗어날 때 색상 초기화
  useEffect(() => {
    return () => resetColor();
  }, [resetColor]);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recordedAt, setRecordedAt] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [images, setImages] = useState<UploadedImage[]>([]);

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
    if (target) URL.revokeObjectURL(target.previewUrl);
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 저장
  const handleSave = () => {
    if (!archiveId || isPending) return;

    // 이미 업로드된 이미지의 fileId 사용
    const files = images
      .filter((img) => img.fileId > 0)
      .map((img, index) => ({
        fileId: img.fileId,
        mediaRole: MediaRole.CONTENT,
        sequence: index,
      }));

    addDiary(
      {
        archiveId: Number(archiveId),
        title,
        content,
        recordedAt,
        color,
        visibility,
        files,
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  // 소유자가 아니면 접근 차단
  if (isArchiveLoading) {
    return <div className="p-10">로딩 중...</div>;
  }

  if (!archive?.isOwner) {
    return (
      <div className="p-10 text-center">
        <p className="typo-body1 text-color-high">권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-w-310 h-full"
      style={{ backgroundColor: getDiaryBgColor(color) }}
    >
      <div className="flex flex-col items-center justify-center max-w-[1920px] mx-auto py-15 gap-15">
        {/* 색상 선택 */}
        <div className="w-310 flex justify-start">
          <ColorChange
            initialColor={{ color }}
            onColorChange={(c) => setColor(c?.color || DEFAULT_DIARY_COLOR)}
            className="font-hakgyoansim-b"
          />
        </div>

        {/* 이미지 첨부 영역 */}
        <div className="w-full">
          <DiaryImage
            images={images}
            onImageAdd={handleImageAdd}
            onImageDelete={handleImageDelete}
            color={color}
          />
        </div>

        {/* 날짜 선택 및 일기 내용 */}
        <div className="w-310 flex flex-col gap-15">
          <div className="flex gap-5 items-center w-full">
            <p className="text-center typo-h1 text-color-high">날짜 : </p>
            <DatePicker
              value={recordedAt}
              onChange={(date) => setRecordedAt(date || "")}
              placeholder="날짜 입력"
              className="flex-1 w-50 justify-center items-center"
            />
          </div>

          <DiaryText
            title={title}
            onTitleChange={(t) => setTitle(t || "")}
            content={content}
            onContentChange={(c) => setContent(c || "")}
            color={color}
          />
        </div>

        {/* 비공개 체크박스 */}
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
      </div>

      <DiaryFooter
        onEdit={() => {}}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
        isDisabled={!isFormValid || isUploading}
        color={color}
      />
    </div>
  );
};

export default DiaryWritePage;
