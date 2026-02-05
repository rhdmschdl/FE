import getDPlusDay from "@/utils/dPlusDay";
import UserIcon from "@/assets/icon/S.svg";
import { Ellipsis } from "lucide-react";
import SettngModal from "./SettngModal";
import { useEffect, useRef, useState } from "react";
import EditableTitle from "../common/EditableTitle";
// ArchiveHeader.tsx의 import 부분 수정
import FansBadge from "@/assets/icon/badge/Fans.tsx";
import NewbieBadge from "@/assets/icon/badge/Newbie.tsx";
import StanBadge from "@/assets/icon/badge/Stan.tsx";
import SupporterBadge from "@/assets/icon/badge/Supporter.tsx";
import MasterBadge from "@/assets/icon/badge/Master.tsx";
import type { Badge, Visibility } from "@/types/archive";


interface ArchiveHeaderProps {
  title?: string;
  ownerNickname?: string;
  badge?: Badge;
  createdAt?: string;
  isMenu?: boolean;
  visibility?: Visibility;
  isFeed?: boolean;
  onTitleSave?: (title: string) => void;
  onVisibilitySave?: (visibility: Visibility) => void;
  onDeleteArchive?: () => void;
  onClickProfile?: () => void;
}

const ArchiveHeader = ({
  title,
  ownerNickname,
  badge,
  createdAt,
  isMenu = false,
  visibility,
  isFeed = false,
  onTitleSave,
  onVisibilitySave,
  onDeleteArchive,
  onClickProfile,
}: ArchiveHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 모달 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
    console.log("메뉴 버튼 클릭");
  };
  const handleCloseModal = () => {
    setIsMenuOpen(false);
  };


  return (
    <div className="w-full flex flex-col items-start  gap-[20px]">
      <div className="w-full flex items-center justify-between">
        {/* <p className="typo-h1 text-color-highest">{title || "아카이브명 (사용자 지정)"}</p> */}
        {isFeed ? (
          <p className="typo-h1 text-color-highest">{title || "아카이브명 (사용자 지정)"}</p>
        ) : (
          <EditableTitle
            value={title ?? "아카이브명 (사용자 지정)"}
            onSave={(next) => {
              console.log("title", next);
              onTitleSave?.(next); // 부모 컴포넌트에서 전달받은 함수 호출
            }}
            placeholder="아카이브명"
            maxLength={50}
          />
        )}
        {isMenu && (
          <div className="relative">
            <button ref={buttonRef} onClick={handleMenuClick}>
              <Ellipsis className="w-8 h-8 text-color-high cursor-pointer" />
            </button>
            {isMenuOpen && (
              <div
                ref={modalRef}
                className="absolute top-full right-0 mt-2 z-50"
                onClick={(e) => {
                  e.stopPropagation(); // 모달 영역 클릭 시 메뉴 버튼 클릭 방지
                }}
              >
                <SettngModal
                  onVisibilitySave={onVisibilitySave}
                  initialVisibility={visibility}
                  onClose={handleCloseModal}
                  onDeleteArchive={onDeleteArchive}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full h-[51px] flex items-center justify-between gap-[20px]">
        {/* 아카이브 소유자 부분 */}
        <button
          onClick={onClickProfile}
          className="flex gap-[10px] items-center cursor-pointer"
        >
          <img src={UserIcon} alt="user" className="w-[40px] h-[40px]" />
          <p className="typo-h2-semibold text-color-high">
            {ownerNickname ?? "사용자명"}
          </p>
        </button>
        {/* 배지 */}
        <div className="flex gap-[20px] justify-center">
          {/* <div className="flex justify-center items-center px-[20px] py-[10px] rounded-[10px] bg-surface-container-40 text-color-high">
            {badge}
          </div> */}
          {badge === "NEWBIE" && <NewbieBadge />} {/* 신입 */}
          {badge === "FANS" && <FansBadge />} {/* 팬 */}
          {badge === "SUPPORTER" && <SupporterBadge />} {/* 후원자 */}
          {badge === "STAN" && <StanBadge />} {/* 스탠 */}
          {badge === "MASTER" && <MasterBadge />} {/* 마스터 */}
          {/* 디데이 부분 */}
          <div
            className="h-[51px] flex justify-center items-center px-[10px] py-[4px] rounded-[4px]
        bg-surface-container-40 typo-h1 text-color-lowest"
          >
            + {getDPlusDay(createdAt ?? "")} DAY
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveHeader;