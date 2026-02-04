import { X } from "lucide-react";
import CalendarDate from "../CalendarDate";
import CalendarTag from "../CalendarTag";
import ColorChange from "@/components/common/ColorChange";
import { BtnBasic } from "@/components/common/Button/Btn";
import { useState } from "react";
import type { CreateEventRequest, DateData, LabelData } from "@/types/calendar";
import EditableTitle from "@/components/common/EditableTitle";

type SportsProps = {
  onClose: () => void;
  startDate: Date | null;
  editData?: LabelData | null;
  onSubmit: (base: Omit<CreateEventRequest, "isSportType">) => void;
};

type ScoreData = {
  teamName: string;
  score: number;
  teamName2: string;
  score2: number;
};

const Sports = ({ onClose, startDate, editData, onSubmit }: SportsProps) => {
  const isEditMode = !!editData;

  const [eventTitle, setEventTitle] = useState(editData?.title || "");

  // 날짜 문자열을 Date 객체로 변환하는 헬퍼 함수
  const parseDateString = (dateStr?: string) => {
    return dateStr ? new Date(dateStr) : null;
  };

  // ✅ editData가 있으면 해당 데이터로 초기화
  const [dateData, setDateData] = useState<DateData>({
    startDate: editData ? parseDateString(editData.startDate) : startDate,
    endDate: editData ? parseDateString(editData.endDate) : startDate,
    isAllDay: editData ? !editData.hasTime : false,
  });

  const [tags, setTags] = useState<string[]>(editData?.hashtags || []);
  const [color, setColor] = useState<string>(editData?.color || "#82BEF5"); // 기본 파란색
  const [scoreData, setScoreData] = useState<ScoreData>({
    teamName: editData?.sportInfo?.team1 || "",
    score: editData?.sportInfo?.score1 || 0,
    teamName2: editData?.sportInfo?.team2 || "",
    score2: editData?.sportInfo?.score2 || 0,
  });

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

    const startTimeStr = !dateData.isAllDay ? formatTime(dateData.startDate) : "00:00";
    const endTimeStr = !dateData.isAllDay ? formatTime(dateData.endDate) : "00:00";

    const body: Omit<CreateEventRequest, "isSportType"> = {
      title: eventTitle || "스포츠 결과 기록",
      startDate: startDateStr,
      startTime: startTimeStr,
      endDate: endDateStr,
      endTime: endTimeStr,
      hasTime: !dateData.isAllDay,
      color,
      hashtags: tags,
      sportInfo: {
        team1: scoreData.teamName,
        team2: scoreData.teamName2,
        score1: scoreData.score,
        score2: scoreData.score2,
      },
    };

    onSubmit(body);
  };

  return (
    <div className="flex flex-col gap-12 items-start">
      {/* 일정 이름 */}
      <div className="w-full flex items-center justify-between">
        <EditableTitle
          value={eventTitle || "스포츠 결과 기록"}
          onSave={(next) => setEventTitle(next)}
          placeholder="스포츠 결과 기록"
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
        onColorChange={(data) => setColor(data?.color || color)}
      />
      {/* 경기결과 (기존 코드 유지) */}
      <div className="w-165 flex gap-5 items-center">
        <p className="typo-h2-semibold text-color-highest">경기결과</p>
        <div className="h-10 flex items-center gap-4 justify-center">
          <input
            className="w-30 h-10 p-2.5 typo-body1 text-color-highest placeholder:text-color-mid border-2 border-border-mid rounded-lg text-center"
            placeholder="팀 이름"
            value={scoreData.teamName}
            onChange={(e) => setScoreData({ ...scoreData, teamName: e.target.value })}
          />
          <input
            className="w-[70px] h-10 p-2.5 typo-body1 text-color-highest placeholder:text-color-mid border-2 border-border-mid rounded-lg text-center"
            placeholder="스코어"
            value={scoreData.score}
            onChange={(e) => setScoreData({ ...scoreData, score: parseInt(e.target.value, 10) || 0 })}
          />
          <p className="typo-body1 text-color-high">:</p>
          <input
            className="w-[70px] h-10 p-2.5 typo-body1 text-color-highest placeholder:text-color-mid border-2 border-border-mid rounded-lg text-center"
            placeholder="스코어"
            value={scoreData.score2}
            onChange={(e) => setScoreData({ ...scoreData, score2: parseInt(e.target.value, 10) || 0 })}
          />
          <input
            className="w-30 h-10 p-2.5 typo-body1 text-color-highest placeholder:text-color-mid border-2 border-border-mid rounded-lg text-center"
            placeholder="팀 이름"
            value={scoreData.teamName2}
            onChange={(e) => setScoreData({ ...scoreData, teamName2: e.target.value })}
          />
        </div>
      </div>
      {/* 확인버튼 */}
      <div className="w-full flex justify-end">
        <BtnBasic onClick={handleConfirm}>
          {isEditMode ? "수정" : "확인"}
        </BtnBasic>
      </div>
    </div>
  );
};

export default Sports;