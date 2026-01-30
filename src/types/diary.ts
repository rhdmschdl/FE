import type { Visibility } from "@/enums/visibilty";
import type { MediaRole } from "@/enums/mediaRole";
import type { FileCompleteResponse } from "./file";
import type {
  DefaultPaginationRequest,
  DefaultPaginationResponse,
} from "./pagination";

export type DiaryFile = {
  fileId: number;
  mediaRole: MediaRole;
  sequence: number;
};

type DiaryId = {
  diaryId: number;
};

type ArchiveId = {
  archiveId: number;
};

type DefaultDiaryResponse = {
  id: number;
  title: string;
  content: string;
  recordedAt: string;
  color: string;
  visibility: Visibility;
  diaryBookId: number;
  createdBy: number;
  files: FileCompleteResponse[];
};

type DefaultDiaryRequest = {
  title: string;
  content: string;
  recordedAt: string;
  color: string;
  visibility: Visibility;
  files?: DiaryFile[];
};

type DiaryBookContent = {
  diaryId: number;
  title: string;
  thumbnailUrl: string | null;
  recordedAt: string;
  visibility: Visibility;
};

export type AddDiaryRequest = ArchiveId & DefaultDiaryRequest;
export type AddDiaryResponse = DefaultDiaryResponse;
export type GetDiaryRequest = DiaryId;
export type GetDiaryResponse = DefaultDiaryResponse;
export type DeleteDiaryRequest = DiaryId;
export type DeleteDiaryResponse = void;
export type UpdateDiaryRequest = DiaryId & Partial<DefaultDiaryRequest>;
export type UpdateDiaryResponse = DefaultDiaryResponse;
export type GetDiaryBookRequest = ArchiveId & DefaultPaginationRequest;
export type GetDiaryBookResponse = {
  title: string;
  content: DiaryBookContent[];
  page: DefaultPaginationResponse;
};
export type UpdateDiaryBookRequest = ArchiveId & {
  title: string;
};
export type UpdateDiaryBookResponse = {
  diaryBookId: number;
  updatedTitle: string;
};
