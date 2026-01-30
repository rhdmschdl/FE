import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "@/types/ticket";
import ImgUpLoadCard from "../common/Card/ImgUpLoadCard";
import ImgCard from "../common/Card/ImgCard";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Rating from "./Rating";
import RequiredLabel from "../common/Form/RequiredLabel";
import TextField from "../common/Form/TextField";
import { BtnBasic } from "@/components/common/Button/Btn";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MediaRole } from "@/enums/mediaRole";
import { MediaType } from "@/enums/mediaType";

type Props = {
  initial?: Partial<Ticket>;
  onSave: (payload: Ticket) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function TicketForm({
  initial = {},
  onSave,
  onCancel,
  submitLabel = "등록",
}: Props) {
  const navigate = useNavigate();
  const [initialState, _] = useState(initial);
  const [isChanged, setIsChanged] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial.imageUrl ?? null
  );
  const [eventName, setEventName] = useState(initial.eventName ?? "");
  const [date, setDate] = useState<string | null>(
    initial.dateTime ? initial.dateTime.split("T")[0] : null
  );
  const [time, setTime] = useState<string | null>(
    initial.dateTime ? initial.dateTime.split("T")[1]?.slice(0, 5) : null
  );
  const [place, setPlace] = useState(initial.place ?? "");
  const [seat, setSeat] = useState(initial.seat ?? "");
  const [casting, setCasting] = useState(initial.casting ?? "");
  const [rating, setRating] = useState<number>(initial.rating ?? 0);
  const [review, setReview] = useState(initial.review ?? "");
  const [fileId, setFileId] = useState<number | null>(initial.fileId ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isFileIdChanged = (initialState.fileId ?? null) !== fileId;
    const isEventNameChanged = (initialState.eventName ?? "") !== eventName;
    const isDateChanged =
      (initialState.dateTime ? initialState.dateTime.split("T")[0] : null) !==
      date;
    const isTimeChanged =
      (initialState.dateTime
        ? initialState.dateTime.split("T")[1]?.slice(0, 5)
        : null) !== time;
    const isPlaceChanged = (initialState.place ?? "") !== place;
    const isSeatChanged = (initialState.seat ?? "") !== seat;
    const isCastingChanged = (initialState.casting ?? "") !== casting;
    const isRatingChanged = (initialState.rating ?? 0) !== rating;
    const isReviewChanged = (initialState.review ?? "") !== review;

    setIsChanged(
      isFileIdChanged ||
        isEventNameChanged ||
        isDateChanged ||
        isTimeChanged ||
        isPlaceChanged ||
        isSeatChanged ||
        isCastingChanged ||
        isRatingChanged ||
        isReviewChanged
    );
  }, [
    fileId,
    eventName,
    date,
    time,
    place,
    seat,
    casting,
    rating,
    review,
    initialState,
  ]);

  // 파일 업로드 훅
  const { upload, isUploading } = useFileUpload({
    onSuccess: (response) => {
      setImageUrl(response.cdnUrl);
      setFileId(response.fileId);
    },
    onError: (error: any) => {
      alert(
        `이미지 업로드 실패: ${error.response?.data?.message || error.message}`
      );
    },
  });

  // 숨김 파일 input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 이전에 생성한 blob URL을 추적(명시적 관리)
  const previousBlobRef = useRef<string | null>(null);

  // 컴포넌트 언마운트 시 남아있는 blob 해제
  useEffect(() => {
    return () => {
      if (
        previousBlobRef.current &&
        previousBlobRef.current.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(previousBlobRef.current);
        } catch (e) {
          // 무시
        }
        previousBlobRef.current = null;
      }
    };
  }, []);

  // 파일 선택 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전에 우리가 생성한 blob이 있으면 해제
    if (
      previousBlobRef.current &&
      previousBlobRef.current.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(previousBlobRef.current);
      } catch (err) {
        // 무시
      }
      previousBlobRef.current = null;
    }

    // 새 blob 생성하여 미리보기 표시
    const previewUrl = URL.createObjectURL(file);
    previousBlobRef.current = previewUrl;
    setImageUrl(previewUrl);

    // 서버에 업로드 (성공 시 onSuccess에서 cdnUrl로 교체됨)
    await upload({
      file,
      mediaRole: MediaRole.CONTENT,
    });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    // 우리가 만든 blob이면 해제
    if (
      previousBlobRef.current &&
      previousBlobRef.current.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(previousBlobRef.current);
      } catch (err) {
        // 무시
      }
      previousBlobRef.current = null;
    }
    // 만약 imageUrl이 서버 URL이라면(예: "https://...") 단순히 null로 처리
    setImageUrl(null);
    setFileId(null); // Explicitly set fileId to null to signal removal
    // 서버에 업로드된 이미지를 삭제하려면 API 호출 추가 필요
  };

  const canSubmit = eventName.trim().length > 0;

  const buildPayload = (): Ticket => {
    const id = (initial as any).id ?? `tmp-${Date.now()}`;
    const dateTimeIso = date
      ? `${date}${time ? "T" + time + ":00" : "T00:00:00"}`
      : undefined;

    const deleteFile = initial.fileId !== null && fileId === null;

    return {
      id,
      imageUrl,
      isRepresentative: initial.isRepresentative ?? false,
      eventName: eventName.trim(),
      dateTime: dateTimeIso ?? null,
      place: place,
      seat: seat,
      casting: casting,
      rating: rating || null,
      review: review,
      fileId: fileId,
      createdAt: initial.createdAt ?? new Date().toISOString(),
      deleteFile: deleteFile,
    };
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      // TODO: API 업로드/저장 로직 추가 시 이곳에서 처리
      onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-310 mx-auto flex flex-col gap-10">
      {/* 숨김 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div>
        <RequiredLabel children="이미지 등록" />
        {imageUrl ? (
          <div>
            <ImgCard
              onClick={() => {}}
              img={imageUrl}
              mediaType={MediaType.IMAGE}
              type="normal"
              readOnly={false}
              onDelete={handleRemoveImage}
              className="w-[276px] h-[145px]"
            />
          </div>
        ) : (
          <div>
            <ImgUpLoadCard
              onClick={openFilePicker}
              className="w-[276px] h-[145px]"
            />
          </div>
        )}
        <div className="text-caption text-color-high mt-3">
          사진은 1장만 등록 가능하며, 미등록 시 기본 이미지로 대체됩니다. (권장
          사이즈: 276*145)
        </div>
      </div>

      <div>
        <RequiredLabel required children="이벤트 이름" />
        <TextField
          value={eventName}
          onChange={(v) => setEventName(v)}
          placeholder="이벤트 이름을 입력해주세요."
          maxLength={30}
          showCount
          multiline={false}
        />
      </div>

      <div>
        <div>
          <RequiredLabel children="날짜 및 시간" />
          <div className="flex gap-5 items-center">
            <DatePicker
              value={date ?? undefined}
              onChange={(d) => setDate(d ?? null)}
            />
            <TimePicker
              value={time ?? undefined}
              onChange={(t) => setTime(t ?? null)}
            />
          </div>
        </div>
      </div>

      <div>
        <RequiredLabel children="장소 이름" />
        <TextField
          value={place}
          onChange={(v) => setPlace(v)}
          placeholder="이벤트 장소를 입력해주세요."
          maxLength={20}
          showCount
          multiline={false}
        />
      </div>

      <div>
        <RequiredLabel children="좌석 위치" />
        <TextField
          value={seat}
          onChange={(v) => setSeat(v)}
          placeholder="좌석 위치"
          maxLength={20}
          showCount
          multiline={false}
        />
      </div>

      <div>
        <RequiredLabel children="캐스팅" />
        <TextField
          value={casting}
          onChange={(v) => setCasting(v)}
          placeholder="캐스팅을 입력해주세요."
          maxLength={30}
          showCount
          multiline={false}
        />
      </div>

      <div>
        <RequiredLabel children="평점" />
        <Rating value={rating} onChange={(v) => setRating(v)} />
      </div>

      <div>
        <RequiredLabel children="관람 후기" />
        <TextField
          value={review}
          onChange={(v) => setReview(v)}
          placeholder="관람 후기를 남겨주세요."
          maxLength={100}
          showCount
          multiline={false}
        />
      </div>

      <div className="flex justify-center gap-4">
        <BtnBasic
          variant="gray"
          onClick={() => {
            // 부모에서 onCancel을 제공하면 그걸 호출, 없으면 뒤로가기
            if (typeof onCancel === "function") {
              onCancel();
            } else {
              navigate(-1);
            }
          }}
        >
          취소
        </BtnBasic>
        <BtnBasic
          variant={canSubmit && isChanged ? "blue" : "gray"}
          onClick={handleSubmit}
          disabled={!canSubmit || !isChanged || isSubmitting || isUploading}
        >
          {submitLabel}
        </BtnBasic>
      </div>
    </div>
  );
}
