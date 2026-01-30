import { Trash2 } from "lucide-react";
import type { LabelData } from "@/types/calendar";
import { useEffect, useState } from "react";
import { BtnBasic } from "@/components/common/Button/Btn";

interface EventListModalProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  label: LabelData[];
  onDelete?: (label: LabelData[]) => void; // ✅ 추가
}

const EventListModal = ({
  open,
  onClose,
  date,
  label,
  onDelete,
}: EventListModalProps) => {
  if (!open || !date) return null;

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // 페이지 스크롤 잠굼
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // ✅ 페이지 스크롤 잠금

    return () => {
      document.body.style.overflow = prev; // ✅ 원복
    };
  }, [open]);

  // 날짜 포맷팅
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[d.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTargets, setDeleteTargets] = useState<LabelData[]>([]); // ✅ 삭제 대상 목록

  const onEditToggle = () => {
    setIsEdit((prev) => !prev);
    if (isEdit) {
      // 편집 모드 종료 시 삭제 대상 초기화
      setDeleteTargets([]);
    }
  };

  // ✅ 삭제 대상에 추가/제거
  const toggleDeleteTarget = (target: LabelData) => {
    setDeleteTargets((prev) =>
      prev.some((l) => l.id === target.id)
        ? prev.filter((l) => l.id !== target.id)
        : [...prev, target]
    );
  };

  // ✅ 저장 시 실제 삭제 실행
  const onSave = () => {
    if (deleteTargets.length === 0) return;
    onDelete?.(deleteTargets);   // ✅ 선택된 라벨들 모두 전달
    setDeleteTargets([]);
    setIsEdit(false);
    onClose();
  };

  const onCancel = () => {
    setDeleteTargets([]);
    setIsEdit(false);
  };

  // 삭제 대상인지 확인
  const isDeleteTarget = (target: LabelData) =>
    deleteTargets.some((l) => l.id === target.id);

  return (
    <div
      className="fixed inset-0 z-[999999] bg-black/50 flex items-center justify-center scroll-stop"
      onMouseDown={onClose} // 바깥 클릭 시 닫기
    >
      {/* ✅ 실제 모달 박스 (여기 클릭은 닫히지 않게) */}
      <div
        className="absolute w-200 flex flex-col pl-20 py-15 pr-15 gap-10 rounded-xl bg-white"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="w-165 flex items-center justify-between">
          <h2 className="typo-h1 text-color-highest">{formatDate(date)}</h2>
        </div>

        {/* 이벤트 목록 */}
        <div className="w-165 flex flex-col gap-5 min-h-95 overflow-y-auto">
          {label.length === 0 ? (
            <div className="w-165 h-full flex items-center justify-center">
              <p className="typo-body1 text-color-mid text-center pt-12 pb-8">
                등록된 일정이 없습니다.
              </p>
            </div>
          ) : (
            label.map((label, idx) => (
              <div
                key={idx}
                className={`w-165 h-25 flex items-center py-1 gap-3 rounded-lg transition-all ${isDeleteTarget(label)
                  ? "bg-red-100 opacity-50" // ✅ 삭제 대상 스타일
                  : "bg-surface-container-10"
                  }`}
              >
                {/* 색상 인디케이터 */}
                <div
                  className="w-5 h-25 rounded-l-lg flex-shrink-0"
                  style={{ backgroundColor: label.color || "#82BEF5" }}
                />
                {/* 이벤트 정보 */}
                <div className=" flex flex-col gap-2.5">
                  <p className="w-[556px] typo-h2-semibold text-color-highest truncate">
                    {label.title}
                  </p>
                  <p className="typo-body2 text-color-mid">
                    {label.hasTime ? label.time : "하루 종일"}
                    {label.isSportType && label.sportInfo && (
                      <span className="ml-2">
                        {label.sportInfo.team1} {label.sportInfo.score1} :{" "}
                        {label.sportInfo.score2} {label.sportInfo.team2}
                      </span>
                    )}
                  </p>
                  {/* 태그 */}
                  {label.hashtags && label.hashtags.length > 0 && (
                    <p>
                      {label.hashtags.slice(0, 2).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="py-0.5 px-2 typo-body2 text-color-high bg-brand-blue-100 rounded-full"
                        >
                          #{tag}
                          {"     "}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                {/* ✅ 편집 모드일 때만 삭제 버튼 표시 */}
                {isEdit && (
                  <button
                    onClick={() => toggleDeleteTarget(label)}
                    className="cursor-pointer p-2"
                  >
                    <Trash2
                      className={`w-6 h-6 ${isDeleteTarget(label)
                        ? "text-red-500"
                        : "text-color-high"
                        }`}
                    />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="w-full flex items-center justify-end">
          {label.length > 0 &&
            (!isEdit ? (
              <BtnBasic
                onClick={onEditToggle}
                className="bg-surface-container-30"
              >
                편집
              </BtnBasic>
            ) : (
              <div className="flex items-center gap-7.5">
                <BtnBasic onClick={onCancel}>취소</BtnBasic>
                <BtnBasic
                  onClick={onSave}
                  className={
                    deleteTargets.length > 0
                      ? "bg-red-500 text-white"
                      : "bg-surface-container-30"
                  }
                >
                  저장
                </BtnBasic>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventListModal;
