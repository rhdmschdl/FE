import { X } from "lucide-react";
import CalendarDate from "../CalendarDate";
import CalendarTag from "../CalendarTag";
import ColorChange from "@/components/common/ColorChange";
import { BtnBasic } from "@/components/common/Button/Btn";
import { useState } from "react";
import type { CreateEventRequest, DateData, LabelData } from "@/types/calendar";
import EditableTitle from "@/components/common/EditableTitle";

type EventProps = {
  onClose: () => void;
  startDate: Date | null;
  editData?: LabelData | null;
  onSubmit: (base: Omit<CreateEventRequest, "isSportType">) => void;
};

const Event = ({ onClose, startDate, editData, onSubmit }: EventProps) => {
  const isEditMode = !!editData;

  // ✅ editData가 있으면 해당 데이터로 초기화
  const [eventTitle, setEventTitle] = useState(editData?.title || "");
  const [dateData, setDateData] = useState<DateData>({
    startDate: editData ? new Date(editData.startDate) : startDate,
    endDate: editData ? new Date(editData.endDate) : startDate,
    isAllDay: editData ? !editData.hasTime : false,
  });
  const [tags, setTags] = useState<string[]>(editData?.hashtags || []);
  const [color, setColor] = useState<string>(editData?.color || "#82BEF5"); // 기본 파란색

  const handleConfirm = () => {
    if (!dateData.startDate) {
      alert("시작 날짜를 선택해주세요.");
      return;
    }
    if (!dateData.endDate) {
      alert("종료 날짜를 선택해주세요.");
      return;
    }

    // ✅ 날짜 포맷팅 함수 (YYYY-MM-DD)
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // ✅ 시간 포맷팅 함수 (HH:mm)
    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const startDateStr = formatDate(dateData.startDate);
    const endDateStr = formatDate(dateData.endDate);

    // 하루종일이면 시간은 "00:00" 혹은 빈 문자열 (API 스펙에 따라 조정, 여기선 00:00으로 가정)
    const startTimeStr = !dateData.isAllDay ? formatTime(dateData.startDate) : "00:00";
    const endTimeStr = !dateData.isAllDay ? formatTime(dateData.endDate) : "00:00";

    const body: Omit<CreateEventRequest, "isSportType"> = {
      title: eventTitle || "무제 일정",
      startDate: startDateStr,
      startTime: startTimeStr,
      endDate: endDateStr,
      endTime: endTimeStr,
      hasTime: !dateData.isAllDay,
      color,
      hashtags: tags,
    };

    onSubmit(body);
  };

  return (
    <div className="flex flex-col gap-12 items-start">
      {/* 일정 이름 */}
      <div className="w-full flex items-center justify-between">

        <EditableTitle
          value={eventTitle || "일정 이름"}
          onSave={(next) => setEventTitle(next)}
          placeholder="일정 이름"
          maxLength={50}
        />
        <X
          className="w-12 h-12 text-color-highest cursor-pointer"
          onClick={onClose}
        />
      </div>
      {/* 일정 기간 */}
      <CalendarDate
        startDateValue={dateData.startDate}
        endDateValue={dateData.endDate} // ✅ 추가
        onDateChange={setDateData}
        initialTime={editData?.startTime} // ✅ 변경
        initialEndTime={editData?.endTime} // ✅ 추가
        initialIsAllDay={editData ? !editData.hasTime : false}
      />
      {/* 태그 설정 */}
      <CalendarTag tags={tags} onTagChange={(data) => setTags(data.tags)} />
      {/* 색상설정 */}
      <ColorChange
        initialColor={{ color }}
        onColorChange={(data) => setColor(data?.color || "")}
      />
      {/* 확인버튼 */}
      <div className="w-full flex justify-end">
        <BtnBasic onClick={handleConfirm}>
          {isEditMode ? "수정" : "확인"}
        </BtnBasic>
      </div>
    </div>
  );
};

export default Event;