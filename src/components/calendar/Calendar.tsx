import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // ✅ [추가] 날짜별 이벤트 슬롯 계산 (연속된 일정을 같은 높이에 배치하기 위함)
  const dateEventsMap = useMemo(() => {
    const map = new Map<string, (LabelData | null)[]>();
    if (!labelData) return map;

    // 1. 정렬: 시작일 빠름 > 기간 김 > ID 순
    const sortedEvents = [...labelData].sort((a, b) => {
      if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
      const durA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
      const durB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
      if (durA !== durB) return durB - durA;
      return a.id - b.id;
    });

    // 2. 각 날짜별로 들어갈 자리(슬롯) 배정
    sortedEvents.forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const dates: string[] = [];

      // 기간 내 날짜 배열 생성
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        dates.push(dateStr);
      }

      // 들어갈 수 있는 최소 인덱스(층) 찾기
      let slotIndex = 0;
      while (true) {
        const isAvailable = dates.every((dateStr) => {
          const daySlots = map.get(dateStr) || [];
          return !daySlots[slotIndex]; // 해당 인덱스가 비어있어야 함
        });
        if (isAvailable) break;
        slotIndex++;
      }

      // 해당 인덱스에 이벤트 할당
      dates.forEach((dateStr) => {
        const daySlots = map.get(dateStr) || [];
        // 배열 중간이 비지 않도록 null로 채움
        while (daySlots.length <= slotIndex) {
          daySlots.push(null);
        }
        daySlots[slotIndex] = event;
        map.set(dateStr, daySlots);
      });
    });

    return map;
  }, [labelData]);

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
  // ... (tileContent 함수 내부)
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      // 날짜 포맷 (YYYY-MM-DD)
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      // ✅ 계산된 슬롯 맵에서 해당 날짜의 이벤트 가져오기
      const dayEvents = dateEventsMap.get(dateString) || [];

      return (
        <div
          className="flex flex-col items-start justify-start w-full h-full gap-1"
          onClick={(e) => {
            e.stopPropagation();
            if (isReadonly) return;
            onChange(date);
            // ... (기존 모달 닫기 로직들)
            setAdditionalPos(null);
            setIsAdditionalModalOpen(false);
            setStickerOptionModalOpen(false);
            setStickerOptionPos(null);
            setSelectedSticker(null);
            setClickDate(date);

            // ✅ null이 아닌 실제 이벤트만 필터링해서 전달
            const validEvents = dayEvents.filter((l): l is LabelData => l !== null);
            setSelectedDateEvents(validEvents);
            setIsEventListModalOpen(true);

            console.log("좌클릭:", dateString, "일정:", validEvents);
          }}
          // ... (onContextMenu는 기존 유지)
          onContextMenu={(e) => {
            // ... 기존 로직 ...
            e.preventDefault();
            e.stopPropagation();
            if (isReadonly) return;
            onChange(date);
            setStickerOptionModalOpen(false);
            setStickerOptionPos(null);
            setSelectedSticker(null);
            const root = calendarRootRef.current;
            if (!root) return;
            const rootRect = root.getBoundingClientRect();
            const tileRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setAdditionalPos({
              x: tileRect.right - rootRect.left - 85,
              y: tileRect.top - rootRect.top + 52,
            });
            setIsAdditionalModalOpen(true);
            setClickDate(date);
          }}
        >
          {/* 1. 커스텀 날짜 숫자 */}
          <div className="custom-date-number w-full h-[36px] px-[16px] text-right typo-h2">
            {date.getDate()}
          </div>

          {/* 2. 라벨 영역 (수정됨) */}
          <div className="w-full flex flex-col items-start gap-[2px]">
            {dayEvents.map((label, idx) => {
              // 빈 슬롯인 경우 (높이 유지용 투명 div)
              if (!label) return <div key={idx} className="h-[24px] w-full" />;

              const isStart = label.startDate === dateString;
              const isEnd = label.endDate === dateString;
              const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

              // 스타일 클래스 계산
              let roundedClass = "rounded-[4px]";
              let marginClass = "";
              let widthClass = "w-full";

              // 기간이 다른 경우에만 연결 스타일 적용
              if (label.startDate !== label.endDate) {
                if (isStart) {
                  roundedClass = "rounded-l-[4px] rounded-r-none";
                  marginClass = "mr-[-6px] z-10"; // 오른쪽으로 확장
                  widthClass = "w-[calc(100%+6px)]";
                } else if (isEnd) {
                  roundedClass = "rounded-r-[4px] rounded-l-none";
                  marginClass = "ml-[-6px] z-10"; // 왼쪽으로 확장
                  widthClass = "w-[calc(100%+6px)]";
                } else {
                  // 중간 날짜
                  roundedClass = "rounded-none";
                  marginClass = "mx-[-6px] z-0";
                  widthClass = "w-[calc(100%+12px)]";
                }

                // 주의 시작(일요일)과 끝(토요일)에서는 끊어보이게 처리
                if (dayOfWeek === 0 && !isStart) {
                  roundedClass = roundedClass.replace("rounded-l-none", "rounded-l-[4px]").replace("rounded-none", "rounded-l-[4px]");
                  marginClass = marginClass.replace("ml-[-6px]", "").replace("mx-[-6px]", "mr-[-6px]");
                  widthClass = "w-[calc(100%+6px)]";
                }
                if (dayOfWeek === 6 && !isEnd) {
                  roundedClass = roundedClass.replace("rounded-r-none", "rounded-r-[4px]").replace("rounded-none", "rounded-r-[4px]");
                  marginClass = marginClass.replace("mr-[-6px]", "").replace("mx-[-6px]", "ml-[-6px]");
                  widthClass = "w-[calc(100%+6px)]";
                }
              }

              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isReadonly) return;
                    setStickerOptionModalOpen(false);
                    setStickerOptionPos(null);
                    setSelectedSticker(null);

                    if (label) {
                      setEditLabelData(label);
                      setEventModalType(label.isSportType ? true : false);
                      setClickDate(date);
                      setEventModalOpen(true);
                    }
                  }}
                  className={`h-[24px] typo-body1 text-left px-2 py-0.5 text-color-highest truncate cursor-pointer hover:opacity-80 relative ${roundedClass} ${marginClass} ${widthClass}`}
                  style={{ backgroundColor: label.color }}
                >
                  {/* 시작일이거나, 주의 시작(일요일)일 때만 텍스트 표시 (선택 사항) */}
                  {(isStart || dayOfWeek === 0) && label.title}
                </div>
              );
            })}

            {/* 3. 스티커 영역 (기존 코드 유지) */}
            {(() => {
              // ... (기존 스티커 렌더링 코드)
              const sticker = stickerData?.find((s) => s.date === dateString);
              if (!sticker) return null;
              return (
                <div
                  className="w-full h-[80px] rounded-[4px] flex items-center justify-center p-2 cursor-pointer hover:opacity-80"
                  onContextMenu={(e) => {
                    // ... (기존 스티커 우클릭 로직)
                    e.preventDefault();
                    e.stopPropagation();
                    if (isReadonly) return;
                    setIsAdditionalModalOpen(false);
                    const root = calendarRootRef.current;
                    if (!root) return;
                    const rootRect = root.getBoundingClientRect();
                    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setStickerOptionPos({
                      x: targetRect.right - rootRect.left - 40,
                      y: targetRect.top - rootRect.top,
                    });
                    setSelectedSticker(sticker);
                    setStickerOptionModalOpen(true);
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
              // ✅ [수정] 선택한 날짜에 이미 스티커가 있는지 확인
              if (clickDate && stickerData) {
                const year = clickDate.getFullYear();
                const month = String(clickDate.getMonth() + 1).padStart(2, "0");
                const day = String(clickDate.getDate()).padStart(2, "0");
                const dateStr = `${year}-${month}-${day}`;

                // 해당 날짜의 스티커 찾기
                const existingSticker = stickerData.find((s) => s.date === dateStr);

                // 스티커가 있다면 수정 데이터로 설정 (수정 모드 진입), 없으면 null (생성 모드)
                setEditStickerData(existingSticker || null);
              } else {
                setEditStickerData(null);
              }
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