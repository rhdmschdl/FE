// src/components/archive/SettngModal.tsx
import { useState, useEffect } from "react";
import RadioButton from "../common/Button/RadioButton";
import { BtnBasic } from "../common/Button/Btn";
import { Visibility } from "@/types/archive";

interface SettngModalProps {
  onVisibilitySave?: (visibility: Visibility) => void;
  initialVisibility?: Visibility; // ✅ 초기값 prop 추가
  onClose?: () => void; // ✅ 모달 닫기 콜백 추가
  onDeleteArchive?: () => void; // ✅ 아카이브 삭제 콜백 추가
}

const SettngModal = ({
  onVisibilitySave,
  initialVisibility = Visibility.PUBLIC,
  onClose,
  onDeleteArchive,
}: SettngModalProps) => {
  const [privacy, setPrivacy] = useState<Visibility>(initialVisibility);

  // ✅ initialVisibility가 변경되면 상태 업데이트
  useEffect(() => {
    if (initialVisibility) {
      setPrivacy(initialVisibility);
    }
  }, [initialVisibility]);

  // ✅ 선택 즉시 저장
  const handleVisibilityChange = (newVisibility: Visibility) => {
    setPrivacy(newVisibility);
    // ✅ 새로운 값을 직접 전달 (setState는 비동기이므로)
    onVisibilitySave?.(newVisibility);
    onClose?.();
  };



  return (
    <div
      className="w-75 px-10 pt-8 pb-6 flex flex-col gap-8 items-start bg-surface-bg rounded-lg shadow-2xl z-50"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* 공개 기준 설정 */}
      <div className="w-55 flex flex-col items-start gap-4">
        <p className="typo-h2-semibold text-color-highest">공개 기준 설정</p>
        <div className="w-full flex flex-col gap-4">
          <RadioButton
            label="전체 공개"
            checked={privacy === Visibility.PUBLIC}
            onClick={() => handleVisibilityChange(Visibility.PUBLIC)}
          />
          <RadioButton
            label="친구 공개"
            checked={privacy === Visibility.RESTRICTED}
            onClick={() => handleVisibilityChange(Visibility.RESTRICTED)}
          />
          <RadioButton
            label="비공개"
            checked={privacy === Visibility.PRIVATE}
            onClick={() => handleVisibilityChange(Visibility.PRIVATE)}
          />
        </div>
      </div>
      {/* 아카이브 삭제 */}
      <div className="flex flex-col items-start gap-2.5 ">
        <p className="typo-h2-semibold text-color-highest pb-4">
          아카이브 삭제
        </p>
        <BtnBasic
          variant="gray"
          onClick={() => {
            console.log("삭제하기");
            onDeleteArchive?.();
          }}
          className="w-55 bg-surface-container-30"
        >
          삭제하기
        </BtnBasic>
        <BtnBasic
          variant="gray"
          onClick={() => {
            onClose?.();
            console.log("취소하기");
          }}
          className="w-55"
        >
          취소하기
        </BtnBasic>
      </div>
    </div>
  );
};

export default SettngModal;