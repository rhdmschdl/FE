import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css"; // 커스텀 CSS
import AdditionalModal from "./modal/AdditionalModal";
import EventModal from "./modal/EventModal";
import type { LabelData, StickerResponse } from "@/types/calendar";
import EventListModal from "./modal/EventListModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCalendar, DeleteSticker } from "@/apis/mutations/calendar/Calendar";
import { StickerType } from "@/enums/sticker";
import StickerOptionModal from "./modal/StickerOptionModal";
// ✅ 스티커 SVG import
import BaseballSticker from "@/assets/icon/sticker/baseball.svg";
import CakeSticker from "@/assets/icon/sticker/cake.svg";
import CameraSticker from "@/assets/icon/sticker/camera.svg";
import CoffeeSticker from "@/assets/icon/sticker/coffee.svg";
import DisplayBoardSticker from "@/assets/icon/sticker/display_board.svg";
import GiftboxSticker from "@/assets/icon/sticker/giftbox.svg";
import HeartSticker from "@/assets/icon/sticker/heart.svg";
import LightStickSticker from "@/assets/icon/sticker/light_stick.svg";
import MoneySticker from "@/assets/icon/sticker/money.svg";
import MusicalNoteSticker from "@/assets/icon/sticker/musical_note.svg";
import ShiningSticker from "@/assets/icon/sticker/shining.svg";
import TicketSticker from "@/assets/icon/sticker/ticket.svg";

interface CalendarProps {
  /** 날짜별 라벨 데이터 (키: "YYYY-MM-DD" 형식, 값: 라벨 텍스트 배열) */
  labelData?: LabelData[];
  /** 날짜별 스티커 데이터 (키: "YYYY-MM-DD" 형식, 값: 스티커 ID 또는 식별자) */
  stickerData?: StickerResponse[];
  /** 스티커 이미지 URL (스티커 영역에 표시할 이미지) */
  // stickerType?: StickerType;
  /** 아카이브 ID */
  archiveId?: number;
  mode?: "interactive" | "readonly";
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type isSportType = true | false | null; //스포츠 타입 여부, null: 스티커 타입

const Calendar = ({
  archiveId,
  labelData,
  stickerData,
  // stickerType,
  mode = "interactive",
}: CalendarProps) => {
  const isReadonly = mode === "readonly";

  // ✅ 스티커 타입에 따라 SVG 반환하는 함수
  const getStickerImage = (type: StickerType): string => {
    const stickerMap: Record<StickerType, string> = {
      [StickerType.SHINING]: ShiningSticker,
      [StickerType.HEART]: HeartSticker,
      [StickerType.GIFTBOX]: GiftboxSticker,
      [StickerType.CAKE]: CakeSticker,
      [StickerType.COFFEE]: CoffeeSticker,
      [StickerType.CAMERA]: CameraSticker,
      [StickerType.LIGHT_STICK]: LightStickSticker,
      [StickerType.TICKET]: TicketSticker,
      [StickerType.MUSICAL_NOTE]: MusicalNoteSticker,
      [StickerType.MONEY]: MoneySticker,
      [StickerType.DISPLAY_BOARD]: DisplayBoardSticker,
      [StickerType.BASEBALL]: BaseballSticker,
    };
    return stickerMap[type];
  };

  // 컴포넌트 안
  const queryClient = useQueryClient();

  const deleteEventsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => DeleteCalendar(id)));
    },
    onSuccess: () => {
      // ✅ 이 아카이브의 월별 이벤트 쿼리 전부 리패치
      queryClient.invalidateQueries({
        queryKey: ["monthlyEvents", archiveId],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("이벤트 삭제 실패:", error);
      alert("이벤트 삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const deleteStickerMutation = useMutation({
    mutationFn: async (stickerId: number) => {
      await DeleteSticker(stickerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyStickers", archiveId] });
    },
    onError: (error) => {
      console.error("스티커 삭제 실패:", error);
      alert("스티커 삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // EventListModal에 넘길 핸들러
  const handleDeleteEvents = (targets: LabelData[]) => {
    const ids = targets.map((t) => t.id);
    deleteEventsMutation.mutate(ids);
  };

  // 피그마처럼 초기에는 선택(Active) 상태가 없도록 null로 시작
  const [value, onChange] = useState<Value>(null);
  const [activeDate, setActiveDate] = useState(new Date());
  // ✅ 우클릭 모달 위치(달력 래퍼 기준 좌표)
  const [additionalPos, setAdditionalPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalType, setEventModalType] = useState<isSportType>(null); //스포츠 타입 여부 null: 스티커 타입
  const [clickDate, setClickDate] = useState<Date | null>(null);
  const [editLabelData, setEditLabelData] = useState<LabelData | null>(null); // ✅ 수정할 라벨 데이터
  const [isEventListModalOpen, setIsEventListModalOpen] = useState(false); //이벤트 목록 모달 열림 여부
  const [selectedDateEvents, setSelectedDateEvents] = useState<LabelData[]>([]); //선택된 날짜의 이벤트 목록
  const [stickerOptionModalOpen, setStickerOptionModalOpen] = useState(false);
  const [stickerOptionPos, setStickerOptionPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<StickerResponse | null>(null);
  const [editStickerData, setEditStickerData] = useState<StickerResponse | null>(null);

  const calendarRootRef = useRef<HTMLDivElement | null>(null); // ✅ 추가

  // 달력 바깥 클릭 시 active 해제 + 우클릭 모달 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const root = calendarRootRef.current;
      if (!root) return;

      const target = e.target as Node | null;
      const isInside = !!target && root.contains(target);

      if (!isInside) {
        // ✅ 달력 바깥 클릭이면 active 해제
        onChange(null);
        setAdditionalPos(null);
        setIsAdditionalModalOpen(false);
        // ✅ 추가
        setStickerOptionModalOpen(false);
        setStickerOptionPos(null);
        setSelectedSticker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNextMonth = () => {
    const nextMonth = new Date(
      activeDate.getFullYear(),
      activeDate.getMonth() + 1,
      1
    );
    setActiveDate(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      activeDate.getFullYear(),
      activeDate.getMonth() - 1,
      1
    );
    setActiveDate(prevMonth);
  };

  // 날짜 포맷팅 함수 (요일별 색상 적용을 위해)
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const day = date.getDay();
      const isCurrentMonth =
        date.getMonth() === activeDate.getMonth() &&
        date.getFullYear() === activeDate.getFullYear();

      let className = "calendar-day";
      if (!isCurrentMonth) {
        className += " calendar-day-other-month";
      } else if (day === 0) {
        className += " calendar-day-sunday";
      } else if (day === 6) {
        className += " calendar-day-saturday";
      } else {
        className += " calendar-day-weekday";
      }
      return className;
    }
    return "";
  };
  // ▼ [핵심] 타일 내부 렌더링 함수
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      // 날짜 포맷 (YYYY-MM-DD) - 데이터 매칭용
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      //라벨 더미 데이터 매칭
      // const label = labelData?.find((label) => label.date === dateString);

      //스티커 더미 데이터 매칭
      // const sticker = stickerData?.find((sticker) => sticker.date === dateString);

      return (
        <div
          className="flex flex-col items-start justify-start w-full h-full gap-1"
          // 좌클릭 시 일정 보기 api 호출
          onClick={(e) => {
            e.stopPropagation();
            if (isReadonly) return;
            onChange(date);
            setAdditionalPos(null);
            setIsAdditionalModalOpen(false);
            // 스티커 옵션 모달 닫기
            setStickerOptionModalOpen(false);
            setStickerOptionPos(null);
            setSelectedSticker(null);
            // 클릭한 날짜 저장
            setClickDate(date);
            const dateString = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const dayEvents =
              labelData?.filter((l) => l.date === dateString) || [];
            setSelectedDateEvents(dayEvents);
            setIsEventListModalOpen(true);

            console.log("좌클릭:", dateString, "일정:", dayEvents);
          }}
          // 우클릭 시 일정 추가 api 호출
          onContextMenu={(e) => {
            e.preventDefault(); // ✅ 브라우저 우클릭 메뉴 막기
            e.stopPropagation();
            if (isReadonly) return;
            onChange(date);

            // 스티커 옵션 모달 닫기
            setStickerOptionModalOpen(false);
            setStickerOptionPos(null);
            setSelectedSticker(null);

            const root = calendarRootRef.current;
            if (!root) return;

            const rootRect = root.getBoundingClientRect();
            const tileRect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            // 달력 래퍼 기준으로 위치 계산 (타일 오른쪽/위쪽 근처에 띄우는 예시)
            setAdditionalPos({
              x: tileRect.right - rootRect.left - 85,
              y: tileRect.top - rootRect.top + 52,
            });

            setIsAdditionalModalOpen(true);
            setClickDate(date);
            console.log(
              "우클릭:",
              String(date.getFullYear()) +
              "년 " +
              String(date.getMonth() + 1).padStart(2, "0") +
              "월 " +
              String(date.getDate()).padStart(2, "0") +
              "일에 일정 추가 api 호출",
              clickDate
            );
          }}
        >
          {/* 1. 커스텀 날짜 숫자 (우측 상단 배치 등 CSS로 제어) */}
          <div className="custom-date-number w-full h-[36px] px-[16px] text-right typo-h2">
            {date.getDate()}
          </div>

          {/* 2. 라벨 영역 */}
          <div className="w-full flex flex-col items-start gap-[10px]">
            {labelData
              ?.filter((l) => l.date === dateString) // ✅ 해당 날짜만 필터링
              .map((label, idx) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isReadonly) return;
                    // ✅ 스티커 옵션 모달 닫기
                    setStickerOptionModalOpen(false);
                    setStickerOptionPos(null);
                    setSelectedSticker(null);

                    if (label) {
                      setEditLabelData(label);
                      setEventModalType(label.isSportType ? true : false);
                      setClickDate(date);
                      setEventModalOpen(true);
                    }

                    console.log(
                      "라벨 클릭:",
                      label.title,
                      "라벨 데이터:",
                      label
                    );
                  }}
                  key={idx}
                  className="w-full typo-body1 text-left px-2 py-1 rounded-[4px] text-color-highest truncate cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: label.color,
                  }}
                >
                  {label.title}
                </div>
              ))}
            {/* 라벨 영역처럼 해당 날짜의 스티커만 표시 */}
            {(() => {
              // 1️⃣ 해당 날짜에 스티커가 있는지 확인
              const sticker = stickerData?.find((s) => s.date === dateString);

              // 2️⃣ 스티커가 없으면 아무것도 렌더링하지 않음 (모달도 당연히 안 나옴)
              if (!sticker) return null;

              // 3️⃣ 스티커가 있을 때만 이 영역이 렌더링됨
              return (
                <div
                  className="w-full h-[80px] rounded-[4px] flex items-center justify-center p-2 cursor-pointer hover:opacity-80"
                  onContextMenu={(e) => {
                    // 4️⃣ 우클릭 이벤트는 스티커가 있을 때만 작동
                    e.preventDefault();
                    e.stopPropagation();
                    if (isReadonly) return;
                    // 다른 모달창 닫기
                    setIsAdditionalModalOpen(false);


                    // 스티커 옵션 모달 열기
                    const root = calendarRootRef.current;
                    if (!root) return;

                    const rootRect = root.getBoundingClientRect();
                    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                    setStickerOptionPos({
                      x: targetRect.right - rootRect.left - 40,
                      y: targetRect.top - rootRect.top,
                    });

                    setSelectedSticker(sticker);  // 5️⃣ 존재하는 스티커를 state에 저장
                    setStickerOptionModalOpen(true);

                    console.log("스티커 우클릭:", sticker);
                  }}
                >
                  <img
                    src={getStickerImage(sticker.stickerType)}
                    alt={`${sticker.stickerType} 스티커`}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div
      ref={calendarRootRef}
      className="flex flex-col items-start mb-10 relative"
    >
      {/* 커스텀 헤더 */}
      <div className="flex items-start justify-center gap-[40px] py-[24px]">
        <button
          onClick={handlePrevMonth}
          className="flex items-center justify-center w-6 h-6 cursor-pointer"
        >
          <ChevronLeft size={24} className="text-color-high" />
        </button>
        <span className="typo-h2-semibold text-color-highest">
          {activeDate.getFullYear()}년 {activeDate.getMonth() + 1}월
        </span>
        <button
          onClick={handleNextMonth}
          className="flex items-center justify-center w-6 h-6 cursor-pointer"
        >
          <ChevronRight size={24} className="text-color-high" />
        </button>
      </div>

      {/* 달력 */}
      <div className="calendar-container w-[1240px]">
        <ReactCalendar
          tileDisabled={isReadonly ? () => true : undefined}
          /** 날짜 클릭 시 실행되는 콜백 함수 */
          // onClickDay={handleClickDate}
          /** 선택된 날짜가 변경될 때 호출되는 콜백 함수 */
          onChange={onChange}
          /** 현재 선택된 날짜 값 */
          value={value}
          /** 달력이 표시할 시작 날짜 (현재 보여지는 월의 기준 날짜) */
          activeStartDate={activeDate}
          /** activeStartDate가 변경될 때 호출되는 콜백 (월 변경 시) */
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) {
              setActiveDate(activeStartDate);
            }
          }}
          /** 달력 타입 설정 ("gregory": 일요일부터 시작하는 그레고리안 달력) */
          calendarType="gregory"
          /** 이전/다음 달의 날짜도 표시할지 여부 */
          showNeighboringMonth={true}
          /** 기본 네비게이션 헤더 표시 여부 (false: 커스텀 헤더 사용) */
          showNavigation={false}
          /** 각 날짜 타일에 적용할 CSS 클래스를 반환하는 함수 (요일별 색상 등) */
          tileClassName={tileClassName}
          /** 각 날짜 타일 내부에 렌더링할 커스텀 컨텐츠를 반환하는 함수 (라벨, 스티커 등) */
          tileContent={tileContent}
          /** 날짜 숫자 포맷팅 함수 (빈 문자열 반환: 기본 날짜 숫자 숨김, tileContent에서 커스텀 렌더링) */
          formatDay={() => ""}
          /** 요일 약어 포맷팅 함수 (Sun, Mon, Tue 등) */
          formatShortWeekday={(_, date) => {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return days[date.getDay()];
          }}
        />
      </div>
      {isAdditionalModalOpen && additionalPos && (
        <div
          style={{
            position: "absolute",
            left: additionalPos.x,
            top: additionalPos.y,
            zIndex: 999999, // ✅ 최상단
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <AdditionalModal
            open
            date={value as Date}
            onClose={() => {
              setIsAdditionalModalOpen(false);
              setAdditionalPos(null);
            }}
            onEventModalOpen={() => {
              setIsAdditionalModalOpen(false);
              setEditLabelData(null);
              setEventModalType(false);
              setEventModalOpen(true);
            }}
            onStickerModalOpen={() => {
              setIsAdditionalModalOpen(false);
              setEditLabelData(null);
              setEventModalType(null);
              setEventModalOpen(true);
            }}
            onSportsModalOpen={() => {
              setIsAdditionalModalOpen(false);
              setEditLabelData(null);
              setEventModalType(true);
              setEventModalOpen(true);
            }}
          />
        </div>
      )}
      {eventModalOpen && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 999999,
          }}
        >
          <EventModal
            archiveId={archiveId}
            open={eventModalOpen}
            onClose={() => {
              setEventModalOpen(false);
              setEditStickerData(null);
            }}
            type={eventModalType}
            startDate={clickDate}
            editData={editLabelData}
            editStickerData={editStickerData}
          />
        </div>
      )}
      {isEventListModalOpen && (
        <EventListModal
          open={isEventListModalOpen}
          onClose={() => setIsEventListModalOpen(false)}
          date={clickDate}
          label={selectedDateEvents}
          onDelete={handleDeleteEvents}
        />
      )}

      {stickerOptionModalOpen && stickerOptionPos && (
        <div
          style={{
            position: "absolute",
            left: stickerOptionPos.x,
            top: stickerOptionPos.y,
            zIndex: 999999,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <StickerOptionModal
            open={stickerOptionModalOpen}
            onClose={() => {
              setStickerOptionModalOpen(false);
              setStickerOptionPos(null);
              setSelectedSticker(null);
            }}
            onEdit={() => {
              // ✅ 스티커 편집 모달 열기
              setEditStickerData(selectedSticker); // 선택된 스티커 데이터 전달
              setEventModalType(null); // 스티커 타입
              setEventModalOpen(true);
              setClickDate(selectedSticker ? new Date(selectedSticker.date) : null);
            }}
            onDelete={() => {
              if (selectedSticker && window.confirm("스티커를 삭제하시겠습니까?")) {
                deleteStickerMutation.mutate(selectedSticker.id);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
