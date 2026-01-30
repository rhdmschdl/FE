import type { SseEventType } from "@/enums/sseEventType";

export type SseNotification = {
  receiverId: number;
  senderId: number;
  type: SseEventType;
  content: string;
  relatedUrl: string;
};
