import { MediaRole } from "@/enums/mediaRole";
import { MediaType } from "@/enums/mediaType";
import { MimeType } from "@/enums/mimeType";
import { UploadStatus } from "@/enums/uploadStatus";

export type MediaItem = {
  id: string;
  url: string;
  role?: MediaRole;
  mediaType: MediaType;
  mimeType?: MimeType;
  isRepresentative?: boolean;
  sequence?: number;
  uploadStatus?: UploadStatus;
  serverId?: string | number;
  progress?: number;
};
