import type { StickerType } from "@/enums/sticker";

export type EventProps = {
  onClose: () => void;
  startDate: Date | null;
};

export type DateData = {
  startDate: Date | null;
  endDate: Date | null;
  isAllDay: boolean;
};

export type ColorData = {
  color: string;
};

export type SportInfo = {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
};

export type LabelData = {
  id: number;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hasTime: boolean;
  color: string;
  isSportType?: boolean; //생성할 때 스포츠 타입 여부 true: 스포츠, false: 일반
  sportInfo?: SportInfo; //스포츠 정보
  hashtags?: string[]; //태그
};

// 이벤트 목록, 조회 응답
export type EventResponse = {
  id: number;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hasTime: boolean;
  color: string;
  sportInfo?: SportInfo;
  hashtags?: string[];
  isSportType?: boolean;
}

// 이벤트 생성 요청
export type CreateEventRequest = {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hasTime: boolean;
  color: string;
  sportInfo?: SportInfo;
  hashtags?: string[];
  isSportType?: boolean;
}

export type UpdateEventRequest = {
  title?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  hasTime?: boolean;
  color?: string;
  sportInfo?: SportInfo;
  hashtags?: string[];
  isSportType?: boolean;
}

export type StickerResponse= {
  id: number;
  date: string;
  stickerType: StickerType;
}

export type CreateStickerRequest = {
  date: string;
  stickerType: StickerType;
}