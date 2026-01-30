import { useState } from "react";
import vectorIcon from "@/assets/icon/VectorGray.svg";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";

interface DiaryCardProps {
  id?: number;
  archiveId?: number;
  diaryId?: number;
  title?: string;
  image?: string;
  date?: string;
  onClick: () => void;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const formatDate = (input: Date | string): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const DiaryCard = ({
  archiveId,
  diaryId,
  title,
  image,
  date,
  onClick,
  isEditMode = false,
  isSelected = false,
  onSelect,
}: DiaryCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = !!image;
  const isLoading = hasImage && !imageLoaded && !imageError;
  const showFallbackIcon = !hasImage || imageError;

  // 체크박스 클릭 핸들러
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onSelect?.();
  };

  return (
    <div
      data-archive-id={archiveId}
      data-diary-id={diaryId}
      onClick={!isEditMode ? onClick : undefined}
      className={`pt-[25px] px-[20px] flex flex-col items-center justify-center w-[360px] h-[300px] rounded-[10px] bg-brand-blue-400 ${
        isEditMode ? "" : "cursor-pointer"
      } relative`}
    >
      {/*  이미지 영역 */}
      <div className="w-[321px] h-[179px] rounded-t-[10px] bg-white flex items-center justify-center overflow-hidden relative">
        {/*  CheckboxIcon (편집 모드일 때만) */}
        {isEditMode && (
          <div
            onClick={handleCheckboxClick}
            className="absolute top-3 left-3 z-20 cursor-pointer"
          >
            <CheckboxIcon checked={isSelected} size={24} />
          </div>
        )}

        {/*  선택되었을 때만 어두운 오버레이 */}
        {isEditMode && isSelected && (
          <div className="absolute inset-0 bg-black/20 rounded-t-[10px] pointer-events-none" />
        )}

        {/* 1) 이미지가 있고, 로딩 성공 */}
        {hasImage && imageLoaded && !imageError && (
          <img
            src={image}
            alt="image"
            className="w-full h-full object-cover rounded-t-[10px]"
          />
        )}

        {/* 2) 이미지가 있고, 로딩 중 */}
        {isLoading && <p className="typo-body2 text-color-mid">로딩중...</p>}

        {/* 3) 이미지가 없거나 로딩 실패 */}
        {showFallbackIcon && !isLoading && (
          <img src={vectorIcon} alt="icon" className="w-[43px] h-[31px]" />
        )}

        {hasImage && (
          <img
            src={image}
            alt="preload"
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="bottom-0 w-[360px] h-[96px] rounded-b-[10px] bg-brand-blue-300">
        <p className="flex mt-[12px] items-center h-[19px] px-[20px] typo-body2 text-color-lowest">
          {date ? formatDate(date) : "yyyy.mm.dd"}
        </p>
        <p className="flex mt-[12px] items-center h-[21px] px-[20px] typo-body1-semibold text-color-highest">
          {title ? title : "사용자가 지정한 일기명"}
        </p>
      </div>
    </div>
  );
};

export default DiaryCard;
