import { useEffect, useState } from "react";
import DateInput from "@/utils/dateValidate";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";

type CalendarDateProps = {
  startDateValue: Date | null;
  endDateValue: Date | null;
  onDateChange?: (data: {
    startDate: Date | null;
    endDate: Date | null;
    isAllDay: boolean;
  }) => void;
  initialTime?: string;
  initialEndTime?: string; // ✅ 종료 시간 prop 추가
  initialIsAllDay?: boolean;
};

const CalendarDate = ({
  startDateValue,
  endDateValue,
  onDateChange,
  initialTime,
  initialEndTime,
  initialIsAllDay,
}: CalendarDateProps) => {
  // ✅ 날짜와 시간을 합쳐서 초기값 생성
  const getInitialDate = (date: Date | null, time?: string): Date | null => {
    if (!date) return null;
    const newDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      newDate.setHours(hours, minutes);
    }
    return newDate;
  };

  const [startDate, setStartDate] = useState<Date | null>(
    getInitialDate(startDateValue, initialTime)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    getInitialDate(endDateValue, initialEndTime)
  );
  const [isAllDay, setIsAllDay] = useState<boolean>(initialIsAllDay || false);

  // [추가/수정] 날짜가 변경될 때 시작일/종료일이 다르면 '하루 종일' 강제 설정
  useEffect(() => {
    if (startDate && endDate) {
      const isSameDate =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

      if (!isSameDate) {
        setIsAllDay(true);
      }
    }
  }, [startDate, endDate]);

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    onDateChange?.({ startDate, endDate, isAllDay });
  }, [startDate, endDate, isAllDay, onDateChange]);

  return (
    <div className="flex flex-col items-start gap-5">
      {/* 일정 시작 */}
      <div className="w-165 flex itmes-center gap-5">
        <p className="py-1.5 typo-h2-semibold text-color-highest">일정 시작</p>
        <div className="w-[550px]">
          <DateInput
            value={startDate}
            onChange={(date) => setStartDate(date)}
            placeholder="YYYY.MM.DD"
            showTime={!isAllDay}
          />
        </div>
      </div>
      {/* 일정 종료 */}
      <div className="w-165 flex itmes-center gap-5">
        <p className="py-1.5 typo-h2-semibold text-color-highest">일정 종료</p>
        <div className="w-[550px]">
          <DateInput
            value={endDate}
            onChange={(date) => setEndDate(date)}
            placeholder="YYYY.MM.DD"
            showTime={!isAllDay}
          />
        </div>
      </div>
      {/* 하루종일 버튼 */}
      <div className="flex items-center gap-3 justify-center">
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => setIsAllDay(!isAllDay)}
        >
          <CheckboxIcon checked={isAllDay} size={24} />
        </div>
        <p className="typo-body1 text-color-highest text-center">하루 종일</p>
      </div>
    </div>
  );
};

export default CalendarDate;
