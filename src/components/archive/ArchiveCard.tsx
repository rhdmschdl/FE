import { useEffect, useState } from "react";
import vectorIcon from "@/assets/icon/VectorGray.svg";
import { twMerge } from "tailwind-merge";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import { PlusIcon } from "lucide-react";

type Props = {
  archiveId?: number;
  userId?: number;
  title?: string;
  // bannerUrl?: string;
  image?: string;
  onClick?: () => void;
  //편집 & 선택 관련
  isEditMode?: boolean;
  checked?: boolean;
  isCreateMode?: boolean;
  onToggleCheck?: (id: string, checked: boolean) => void;
};

const ArchiveCard = ({
  archiveId,
  userId,
  title,
  // bannerUrl,
  image,
  onClick,
  isEditMode = false,
  checked = false,
  isCreateMode = false,
  onToggleCheck,
}: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // 편집 모드가 해제되면 선택 상태도 초기화
  useEffect(() => {
    if (!isEditMode) {
      // 편집모드가 아닐 때 선택 상태를 모두 false로 초기화.
      setIsSelected(false);
    }
    //의존성 배열로 설정해 isEditMode가 변경될 때마다 실행되도록 함.
  }, [isEditMode]);

  const hasImage = !!image;
  const isLoading = hasImage && !imageLoaded && !imageError;
  const showFallbackIcon = !hasImage || imageError;

  // 편집 모드일 때 카드 클릭 시 체크박스 토글
  const handleCardClick = () => {
    if (isEditMode) {
      // 편집모드에서 카드 영역 클릭했을 때도 체크 토글 되도록 (부모 콜백 호출)
      onToggleCheck?.(String(archiveId), !checked);
    } else {
      onClick?.();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCheck?.(String(archiveId), !checked);
  };

  return (
    <div
      data-archive-id={archiveId}
      data-user-id={userId}
      onClick={handleCardClick}
      className="pt-[25px] px-5 flex flex-col items-center justify-center w-90 h-75 rounded-[10px] bg-brand-blue-400 cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative w-[321px] h-[179px] rounded-t-[10px] bg-white flex items-center justify-center overflow-hidden">
        {/* 편집 모드일 때 왼쪽 위 체크박스 */}
        {isEditMode && (
          <button
            type="button"
            onClick={handleCheckboxClick}
            className="absolute top-4 left-5 z-10"
            aria-pressed={checked}
            aria-label={checked ? "선택 해제" : "선택"}
          >
            <CheckboxIcon checked={checked} disabled={false} size={24} />
          </button>
        )}
        {isCreateMode && (
          <div className="flex justify-center items-center w-full h-full">
            <PlusIcon className="w-20 h-20 text-color-low" />
          </div>
        )}
        {/* 1) 이미지가 있고, 로딩 성공 */}
        {!isCreateMode && hasImage && imageLoaded && !imageError && (
          <>
            <img
              src={image}
              alt="image"
              className={twMerge(
                "w-full h-full object-cover rounded-t-[10px] transition-opacity pointer-events-none",
                isSelected && "opacity-50 select-none"
              )}
            />
            {/* 선택 시 오버레이 (linear-gradient 효과) */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent rounded-t-[10px] pointer-events-none" />
            )}
          </>
        )}

        {/* 2) 이미지가 있고, 로딩 중 */}
        {!isCreateMode && isLoading && <p className="typo-body2 text-color-mid">로딩중...</p>}

        {/* 3) 이미지가 없거나 로딩 실패 */}
        {!isCreateMode && showFallbackIcon && !isLoading && (
          <div className="relative">
            <img
              src={vectorIcon}
              alt="icon"
              className="w-[43px] h-[31px] select-none "
            />
            {/* 선택 시 오버레이 */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent rounded-t-[10px]" />
            )}
          </div>
        )}
        {/* 4) 이미지가 있고, 로딩 성공 후 숨김 처리 */}
        {!isCreateMode && hasImage && (
          <img
            src={image}
            alt="preload"
            className="hidden pointer-events-none"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex items-center bottom-0 w-90 h-24 rounded-b-[10px] bg-brand-blue-300 px-5">
        <p className="typo-body1-semibold text-color-highest truncate w-full">
          {title ? title : "사용자가 지정한 아카이브 파일명"}
        </p>
      </div>
    </div>
  );
};

export default ArchiveCard;
