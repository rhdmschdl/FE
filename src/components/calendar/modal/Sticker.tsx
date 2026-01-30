import { StickerType } from "@/enums/sticker";
import { X } from "lucide-react";
import { useState } from "react";
import { BtnBasic } from "@/components/common/Button/Btn";

import ShiningSticker from "@/assets/icon/sticker/shining.svg";
import HeartSticker from "@/assets/icon/sticker/heart.svg";
import GiftboxSticker from "@/assets/icon/sticker/giftbox.svg";
import CakeSticker from "@/assets/icon/sticker/cake.svg";
import CoffeeSticker from "@/assets/icon/sticker/coffee.svg";
import CameraSticker from "@/assets/icon/sticker/camera.svg";
import LightStickSticker from "@/assets/icon/sticker/light_stick.svg";
import TicketSticker from "@/assets/icon/sticker/ticket.svg";
import MusicalNoteSticker from "@/assets/icon/sticker/musical_note.svg";
import MoneySticker from "@/assets/icon/sticker/money.svg";
import DisplayBoardSticker from "@/assets/icon/sticker/display_board.svg";
import BaseballSticker from "@/assets/icon/sticker/baseball.svg";

type StickerProps = {
  onClose: () => void;
  date?: Date | null;
  onSubmit?: (stickerType: StickerType) => void;
  initialSticker?: StickerType | null;

};

const Sticker = ({ onClose, date, onSubmit, initialSticker }: StickerProps) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerType | null>(
    initialSticker || null
  );

  const getStickerImage = (type: StickerType): string => {
    const stickerMap: Record<StickerType, string> = {
      [StickerType.SHINING]: ShiningSticker,
      [StickerType.LIGHT_STICK]: LightStickSticker,
      [StickerType.HEART]: HeartSticker,
      [StickerType.GIFTBOX]: GiftboxSticker,
      [StickerType.CAKE]: CakeSticker,
      [StickerType.COFFEE]: CoffeeSticker,
      [StickerType.CAMERA]: CameraSticker,
      [StickerType.TICKET]: TicketSticker,
      [StickerType.MUSICAL_NOTE]: MusicalNoteSticker,
      [StickerType.MONEY]: MoneySticker,
      [StickerType.DISPLAY_BOARD]: DisplayBoardSticker,
      [StickerType.BASEBALL]: BaseballSticker,
    };
    return stickerMap[type];
  };

  const handleConfirm = () => {
    if (!selectedSticker) {
      alert("스티커를 선택해주세요.");
      return;
    }
    onSubmit?.(selectedSticker);
  };

  // 날짜 포맷팅
  const formatDate = (d: Date) => {
    return d.getDate();
  };

  return (
    <div className="flex flex-col gap-12 items-start">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="typo-h1 text-color-highest text-left">스티커</p>
          {date && (
            <div className="flex items-center">
              <span className="typo-h2 text-color-mid">|</span>
              <span className="ml-2 px-2.5 py-1 bg-brand-red text-white typo-body2-semibold rounded">
                {formatDate(date)}
              </span>
            </div>
          )}
        </div>
        <X
          className="w-12 h-12 text-color-highest cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* 스티커 선택 그리드 */}
      <div className="w-full grid grid-cols-5 gap-x-7 gap-y-[25px]">
        {Object.values(StickerType).map((stickerType) => (
          <button
            key={stickerType}
            onClick={() => setSelectedSticker(
              selectedSticker === stickerType ? null : stickerType
            )}
            className={`
              w-25 h-25 rounded-2xl flex items-center justify-center
              transition-all cursor-pointer p-4
              ${selectedSticker === stickerType
                ? "border-2 border-brand-blue-400 scale-110"
                : "border-2 border-transparent hover:scale-105"
              }
            `}
          >
            <img
              src={getStickerImage(stickerType)}
              alt={stickerType}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* 확인 버튼 */}
      <div className="w-full flex justify-end">
        <BtnBasic
          onClick={handleConfirm}
          disabled={!selectedSticker}
        >
          확인
        </BtnBasic>
      </div>
    </div>
  );
};

export default Sticker;