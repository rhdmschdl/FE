import vectorIcon from "@/assets/icon/VectorGray.svg";
import { Link } from "lucide-react";

interface RepostCardProps {
  id?: number;
  archiveId?: number;
  tabId?: number;
  title?: string;
  image?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const RepostCard = ({
  id,
  archiveId,
  tabId,
  title,
  image,
  isLoading = false,
  onClick,
}: RepostCardProps) => {
  return (
    <button
      type="button"
      data-repost-id={id}
      data-archive-id={archiveId}
      data-tab-id={tabId}
      onClick={onClick}
      className="w-90 h-[294px] flex flex-col pt-[5px] items-center justify-center rounded-[10px] bg-brand-blue-200 cursor-pointer"
    >
      <div className="w-[350px] h-[193px] rounded-t-[10px] bg-white flex items-center justify-center overflow-hidden">
        {isLoading ? (
          // 이미지 자리 스켈레톤
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : image ? (
          // image가 truthy일 때만 렌더
          <img src={image} alt="image" className="w-full h-full object-cover" />
        ) : (
          // 기본 아이콘
          <img src={vectorIcon} alt="icon" className="w-[43px] h-[31px]" />
        )}
      </div>
      <div className="w-full h-24 rounded-b-[10px] bg-brand-blue-300">
        <div className="w-full h-full flex items-center justify-start px-4 gap-2">
          <Link className="w-6 h-6 text-color-high" />
          {isLoading ? (
            // 제목 자리 스켈레톤
            <div className="h-5 w-36 bg-gray-200 animate-pulse rounded" />
          ) : title ? (
            <p className="typo-body1-semibold text-color-highest truncate">
              {title}
            </p>
          ) : (
            <p className="typo-body1-semibold text-color-highest">
              리포스팅 기록 이름
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default RepostCard;
