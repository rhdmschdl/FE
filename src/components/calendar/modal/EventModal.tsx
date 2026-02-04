import { useEffect } from "react";
import Event from "./Event";
import Sports from "./Sports";
import Sticker from "./Sticker";
import type { CreateEventRequest, LabelData, StickerResponse, UpdateEventRequest } from "@/types/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchCalendar, PostCalendar, PostSticker, UpdateSticker } from "@/apis/mutations/calendar/Calendar";
import type { StickerType } from "@/enums/sticker";
import { AxiosError } from "axios";

type ModalType = true | false | null;

interface EventModalProps {
  /** 아카이브 ID */
  archiveId?: number;
  open: boolean;
  onClose: () => void;
  type: ModalType;
  startDate: Date | null;
  editData?: LabelData | null;
  editStickerData?: StickerResponse | null; // ✅ 스티커 수정 데이터 추가
}

const EventModal = ({
  archiveId,
  open,
  onClose,
  type,
  startDate,
  editData,
  editStickerData,
}: EventModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!editData && editData.id != null;
  const isStickerEditMode = !!editStickerData && editStickerData.id != null; // ✅ 스티커 수정 모드

  // ✅ 일정 생성 mutation
  const createEventMutation = useMutation({
    mutationFn: (body: CreateEventRequest) => PostCalendar(archiveId as number, body),
    onSuccess: () => {
      // TODO: 월별 일정 refetch 필요하면 여기서 invalidateQueries
      queryClient.invalidateQueries({ queryKey: ["monthlyEvents", archiveId] });
      onClose();
    },
    onError: (error) => {
      console.error("일정 생성 실패:", error);
      alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // ✅ 일정 수정 mutation
  const updateEventMutation = useMutation({
    mutationFn: (body: UpdateEventRequest) => PatchCalendar(editData?.id as number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyEvents", archiveId] });
      onClose();
    },
    onError: (error) => {
      console.error("일정 수정 실패:", error);
      alert("일정 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
  // ✅ 스티커 생성 mutation 추가
  const createStickerMutation = useMutation({
    mutationFn: (body: { date: string; stickerType: StickerType }) =>
      PostSticker(archiveId as number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyStickers", archiveId] });
      onClose();
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        alert("이미 스티커가 있습니다.");
      }
      else {
        alert("스티커 생성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  });
  // ✅ 스티커 수정 mutation 추가
  const updateStickerMutation = useMutation({
    mutationFn: (body: { date: string; stickerType: StickerType }) =>
      UpdateSticker(editStickerData?.id as number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyStickers", archiveId] });
      onClose();
    },
    onError: (error) => {
      console.error("스티커 수정 실패:", error);
      alert("스티커 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // ✅ 자식에서 보내주는 기본 데이터 + 여기서 isSportType만 세팅
  const handleSubmit = (base: Omit<CreateEventRequest, "isSportType">) => {
    const payload = {
      ...base,
      isSportType: type === true,
    };

    if (isEditMode) {
      // 수정 모달일 때
      updateEventMutation.mutate(payload);
    } else {
      // 새로 등록할 때
      createEventMutation.mutate(payload);
    }
  };
  // ✅ 스티커 제출 핸들러 - 생성/수정 분기 처리
  const handleStickerSubmit = (stickerType: StickerType) => {
    if (!startDate && !editStickerData) {
      alert("날짜를 선택해주세요.");
      return;
    }

    // 날짜를 YYYY-MM-DD 형식으로 변환
    const dateToUse = editStickerData ? new Date(editStickerData.date) : startDate!;
    const year = dateToUse.getFullYear();
    const month = String(dateToUse.getMonth() + 1).padStart(2, "0");
    const day = String(dateToUse.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    const body = { date, stickerType };

    if (isStickerEditMode) {
      // 스티커 수정
      updateStickerMutation.mutate(body);
    } else {
      // 스티커 생성
      createStickerMutation.mutate(body);
    }
  };


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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] bg-black/50 flex items-center justify-center scroll-stop"
      onMouseDown={onClose} // 바깥 클릭 시 닫기
    >
      {/* ✅ 실제 모달 박스 (여기 클릭은 닫히지 않게) */}
      <div
        className="absolute w-200 flex flex-col pl-20 py-[54px] pr-15 gap-12 rounded-xl bg-white"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {type === false && (
          <Event onClose={onClose} startDate={startDate} editData={editData} onSubmit={handleSubmit} />
        )}
        {type === true && (
          <Sports onClose={onClose} startDate={startDate} editData={editData} onSubmit={handleSubmit} />
        )}
        {type === null && <Sticker onClose={onClose} date={startDate} onSubmit={handleStickerSubmit} initialSticker={editStickerData?.stickerType} />}
      </div>
    </div>
  );
};

export default EventModal;