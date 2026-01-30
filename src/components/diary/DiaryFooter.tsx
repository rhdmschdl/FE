import DiaryFooterImage from "@/assets/icon/DiaryFooterImage";
import { BtnBasic } from "@/components/common/Button/Btn";
import { getDiaryDarkColor, DEFAULT_DIARY_COLOR } from "@/constants/diaryColors";

type DiaryFooterProps = {
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEdit?: boolean;
  isDisabled?: boolean;
  noBtn?: boolean;
  color?: string;
};

export const DiaryFooter = ({
  onSave,
  onCancel,
  onEdit,
  onDelete,
  isEdit = false,
  isDisabled = false,
  noBtn = false,
  color = "white",
}: DiaryFooterProps) => {
  return (
    <div className="relative w-screen aspect-[1920/218]">
      {/* SVG 배경 */}
      <DiaryFooterImage />
      {!noBtn && (
        <div className="relative z-10 flex items-center justify-center gap-4 px-20 h-full">
          {isEdit ? (
            <div className="relative z-10 flex items-center justify-center gap-4 px-20 h-full">
              <BtnBasic
                variant="gray"
                onClick={() => onDelete?.()}
                className="px-8"
              >
                삭제
              </BtnBasic>
              <BtnBasic
                variant="blue"
                onClick={() => onEdit?.()}
                className="px-8"
                color={color !== DEFAULT_DIARY_COLOR ? color : undefined}
                hoverColor={color !== DEFAULT_DIARY_COLOR ? getDiaryDarkColor(color) : undefined}
              >
                수정
              </BtnBasic>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-4 px-20 h-full">
              <BtnBasic
                variant="gray"
                onClick={() => onCancel?.()}
                className="px-8"
              >
                취소
              </BtnBasic>
              <BtnBasic
                variant="blue"
                onClick={() => onSave?.()}
                className="px-8"
                color={color !== DEFAULT_DIARY_COLOR ? color : undefined}
                hoverColor={color !== DEFAULT_DIARY_COLOR ? getDiaryDarkColor(color) : undefined}
                disabled={isDisabled}
              >
                등록
              </BtnBasic>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
