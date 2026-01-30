import { useState } from "react";
import vectorIcon from "@/assets/icon/VectorGray.svg";

interface FeedCardProps {
  id?: number;
  title?: string;
  image?: string;
  onClick: () => void;
}

const FeedCard = ({ id, title, image, onClick }: FeedCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = !!image;
  const isLoading = hasImage && !imageLoaded && !imageError;
  const showFallbackIcon = !hasImage || imageError;

  return (
    <div
      key={id}
      onClick={onClick}
      className="pt-[25px] px-[20px] flex flex-col items-center justify-center w-[360px] h-[300px] rounded-[10px] bg-brand-blue-400 cursor-pointer"
    >
      <div className="w-[321px] h-[179px] rounded-t-[10px] bg-white flex items-center justify-center overflow-hidden">
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
        <p className="flex items-center h-[96px] px-[20px] typo-body1-semibold text-color-highest">
          {title ? title : "사용자가 지정한 아카이브 파일명"}
        </p>
      </div>
    </div>
  );
};

export default FeedCard;
