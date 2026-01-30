import { Sticker, Trash2 } from "lucide-react";

interface StickerOptionModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const StickerOptionModal = ({
  open,
  onClose,
  onEdit,
  onDelete,
}: StickerOptionModalProps) => {
  if (!open) return null;

  return (
    <div className="flex flex-col w-60 bg-white rounded-lg shadow-lg pt-8 px-10 pb-6">
      <div className="flex flex-col gap-4">
        {/* 헤더 */}
        <div>
          <p className="typo-h2-semibold text-color-highest">스티커 수정</p>
        </div>

        {/* 옵션 */}
        <div className="flex flex-col gap-3">
          {/* 편집하기 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onClose();
            }}
            className="flex items-center gap-2 pl-1 py-1 hover:bg-surface-container-10 transition-colors cursor-pointer"
          >
            <Sticker className="w-5 h-5 text-color-high" />
            <span className="typo-body1 text-color-highest">편집하기</span>
          </button>

          {/* 삭제하기 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
            className="flex items-center gap-2 pl-1 py-1 hover:bg-surface-container-10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5 text-color-high" />
            <span className="typo-body1 text-color-highest">삭제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickerOptionModal;