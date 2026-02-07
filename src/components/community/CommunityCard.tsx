import { useState } from "react";
import vectorIcon from "@/assets/icon/Vector.svg";
import shareIcon from "@/assets/icon/Share.svg";

interface CommunityCardProps {
  title?: string;
  categoryLabel?: string; // 한글로 화면에 보여줄 라벨
  categoryValue?: string; // 필터링용 value (영문)
  content?: string;
  img?: string;
  onClick?: () => void; // 클릭 시 이벤트
  onClickShare?: () => void; // 공유 시 이벤트
}

const CommunityCard = ({
  title,
  categoryLabel,
  categoryValue,
  content,
  img,
  onClick,
  onClickShare,
}: CommunityCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={(e) => {
        // 공유 버튼이나 그 자식 요소를 클릭한 경우 카드 클릭 이벤트 실행 안 함
        const target = e.target as HTMLElement;
        if (target.closest("button")) {
          return;
        }
        onClick?.();
      }}
      className="w-90 h-78.5 rounded-lg bg-surface-container-10 cursor-pointer"
      data-category-value={categoryValue}
    >
      {/* 타이틀 */}
      <div className="flex w-full h-14.5 px-5 py-3 items-center ">
        <p className="typo-h3-semibold text-color-highest truncate">
          {title ? title : "게시물 제목"}
        </p>
      </div>
      {/* 이미지 */}
      <div className="flex items-center justify-center w-full h-45 bg-surface-container-20">
        {img && !imageError ? (
          <img
            src={img}
            alt="img"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <img src={vectorIcon} alt="icon" className="w-[43px] h-[31px]" />
        )}
      </div>
      {/* 카테코리 & 게시글 내용 */}
      <div className="flex flex-col w-full h-19.5 px-5 py-3">
        <p className="typo-caption text-color-high">
          {categoryLabel ?? "카테고리"}
        </p>
        <div className="flex items-center w-full h-6 mt-1 gap-2">
          <p className="w-full typo-body2 text-color-highest truncate">
            {content ? content : "게시글 내용"}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClickShare?.();
            }}
            className="cursor-pointer hover:opacity-70 active:opacity-50"
          >
            <img src={shareIcon} alt="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
