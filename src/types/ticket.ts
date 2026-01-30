import type { FileCompleteResponse } from "./file";
import type {
  DefaultPaginationRequest,
  DefaultPaginationResponse,
} from "./pagination";
import { PaginationSort } from "@/enums/paginationSort";
import { PaginationDirection } from "@/enums/paginationDirection";

// 개발 편의를 위한 타입
export type Ticket = {
  id: number;
  imageUrl?: string | null;
  isRepresentative?: boolean;
  eventName: string; // 필수
  dateTime?: string | null;
  place?: string | null;
  seat?: string | null;
  casting?: string | null;
  rating?: number | null;
  review?: string | null;
  fileId?: number | null;
  createdAt?: string | null;
  deleteFile?: boolean;
};

type TicketId = {
  ticketId: number;
};

type ArchiveId = {
  archiveId: number;
};

type DefaultTicketResponse = {
  id: number;
  title: string;
  date: string | null;
  location: string | null;
  seat: string | null;
  casting: string | null;
  score: number | null;
  review: string | null;
  ticketBookId: number;
  file: FileCompleteResponse | null;
};

type DefaultTicketRequest = {
  title: string;
  date?: string | null;
  location?: string | null;
  seat?: string | null;
  casting?: string | null;
  score?: number | null;
  review?: string | null;
  fileId?: number | null;
};

type TicketBookContent = {
  id: number;
  title: string;
  thumbnail: string | null;
  date: string;
  seat?: string | null;
  location?: string | null;
  casting?: string | null;
  score?: number | null;
  review?: string | null;
  createdAt: string;
  lastModifiedAt: string;
};

export type AddTicketRequest = ArchiveId & DefaultTicketRequest;

export type AddTicketResponse = DefaultTicketResponse;
export type GetTicketRequest = TicketId;
export type GetTicketResponse = DefaultTicketResponse;

export type DeleteTicketRequest = TicketId;
export type DeleteTicketResponse = void; // 204 빈 응답이라 void 처리

export type UpdateTicketRequest = TicketId &
  DefaultTicketRequest & {
    deleteFile?: boolean;
  };

export type UpdateTicketResponse = DefaultTicketResponse;

export type GetTicketBookRequest = ArchiveId &
  DefaultPaginationRequest & {
    sort?: PaginationSort;
    direction?: PaginationDirection;
  };

export type GetTicketBookResponse = {
  title: string;
  content: TicketBookContent[];
  page: DefaultPaginationResponse;
};

export type UpdateTicketBookRequest = ArchiveId & {
  title: string;
};

export type UpdateTicketBookResponse = {
  ticketBookId: number;
  updatedTitle: string;
};
