import { useState } from "react";
import { twMerge } from "tailwind-merge";
import vectorIcon from "@/assets/icon/Vector.svg";
import { X } from "lucide-react";
import { MediaType } from "@/enums/mediaType";

type CardType = "representative" | "normal";

interface ImgCardProps {
  onClick: () => void;
  selected?: boolean;
  onDelete?: () => void;
  img?: string;
  mediaType?: MediaType;
  type?: CardType;
  className?: string;
  readOnly?: boolean;
}

const ImgCard = ({
  onClick,
  selected = false,
  onDelete,
  img,
  mediaType,
  type = "normal",
  readOnly = false,
  className,
}: ImgCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const base =
    "w-[360px] h-[180px] rounded-[8px] text-color-lowest flex items-center justify-center relative overflow-hidden cursor-pointer";
  const representative =
    "bg-surface-container-20 border-2 border-color-primary border-solid";
  const normal = "bg-surface-container-10";
  const enabled = "bg-surface-container-20";
  const hover = "hover:bg-surface-container-30";
  const selectedCls = "border-2 border-color-primary border-solid ";

  const typeCls = type === "representative" ? representative : normal;

  const isVideo = mediaType === MediaType.VIDEO;

  // 이미지가 없거나 로드 실패했거나 아직 로딩 중일 때 벡터 아이콘 표시
  const showIcon =
    !img || (!imageLoaded && mediaType === MediaType.IMAGE) || imageError;

  return (
    <div
      onClick={onClick}
      className={twMerge(
        base,
        typeCls,
        enabled,
        selected ? selectedCls : enabled,
        type === "representative" ? "cursor-default" : hover,
        className
      )}
    >
      {type === "representative" && (
        <div className="absolute top-0 left-0 bg-brand-blue-400 text-text-lowest px-4 py-2 rounded-tl-[6px] z-50">
          <p className="typo-body2-semibold">대표</p>
        </div>
      )}
      {/* X 버튼 - 오른쪽 상단 */}
      {onDelete && !readOnly && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
            onDelete();
          }}
          className="absolute flex flex-col items-center justify-center top-[12px] right-[19px] w-[30px] h-[30px] 
          rounded-[20px] opacity-50 bg-[#7D9AB2] z-20 hover:opacity-70"
          aria-label="삭제"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
      {isVideo ? (
        <>
          {img ? (
            <video
              src={img}
              controls
              playsInline
              // autoPlay muted
              className="w-full h-full object-cover absolute inset-0"
              onLoadedData={() => {
                // 로딩되면 아이콘 숨기려면 상태 변경 로직 추가 가능
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          ) : (
            <div className="flex items-center justify-center">
              <img src={vectorIcon} alt="icon" className="w-[43px] h-[31px]" />
            </div>
          )}
        </>
      ) : (
        <>
          {img && (
            <img
              src={img}
              alt="img"
              className={twMerge(
                "w-full h-full object-cover absolute inset-0",
                imageLoaded && !imageError ? "block" : "hidden"
              )}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          )}
          {/* 벡터 아이콘: 이미지가 없거나 로드 실패했거나 로딩 중일 때만 표시 */}
          {showIcon && (
            <div className="flex items-center justify-center">
              <img src={vectorIcon} alt="icon" className="w-[43px] h-[31px]" />
            </div>
          )}
        </>

        // video
      )}
    </div>
  );
};

export default ImgCard;
