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
    startDate: editData ? new Date(editData.date) : startDate,
    endDate: null,
    isAllDay: editData ? !editData.hasTime : false,
  });
  const [tags, setTags] = useState<string[]>(editData?.hashtags || []);
  const [color, setColor] = useState<string>(editData?.color || "#82BEF5"); // 기본 파란색

  const handleConfirm = () => {
    if (!dateData.startDate) {
      alert("시작 날짜를 선택해주세요.");
      return;
    }

    // ✅ 로컬 기준 날짜 문자열
    const year = dateData.startDate.getFullYear();
    const month = String(dateData.startDate.getMonth() + 1).padStart(2, "0");
    const day = String(dateData.startDate.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // ✅ 로컬 기준 시간 문자열 (하루종일이 아니면)
    let time: string | undefined;
    if (!dateData.isAllDay) {
      const hours = String(dateData.startDate.getHours()).padStart(2, "0");
      const minutes = String(dateData.startDate.getMinutes()).padStart(2, "0");
      time = `${hours}:${minutes}`;
    }

    const body: Omit<CreateEventRequest, "isSportType"> = {
      title: eventTitle || "무제 일정",
      date,
      time,
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
        onDateChange={setDateData}
        initialTime={editData?.time} // ✅ 추가
        initialIsAllDay={editData ? !editData.hasTime : false} // ✅ 추가
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
