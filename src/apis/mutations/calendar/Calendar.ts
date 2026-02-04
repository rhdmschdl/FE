import axiosInstance from "@/apis/axios";
import type { CreateEventRequest, CreateStickerRequest, EventResponse, StickerResponse, UpdateEventRequest } from "@/types/calendar";

export const PostCalendar = async (archiveId: number, data: CreateEventRequest): Promise<EventResponse> => {
  const response = await axiosInstance.post(`/api/v1/events/${archiveId}`, data);
  return response.data;
}

export const PatchCalendar = async (eventId: number, data: UpdateEventRequest): Promise<EventResponse> => {
  const response = await axiosInstance.patch(`/api/v1/events/${eventId}`, data);
  return response.data;
}

export const DeleteCalendar = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/events/${eventId}`);
}

export const PostSticker = async (archiveId: number, data: CreateStickerRequest): Promise<StickerResponse> => {
  const response = await axiosInstance.post(`/api/v1/stickers/${archiveId}`, data);
  return response.data; 
}

export const UpdateSticker = async (stickerId: number, data: CreateStickerRequest): Promise<StickerResponse> => {
  const response = await axiosInstance.patch(`/api/v1/stickers/${stickerId}`, data);
  return response.data;
}

export const DeleteSticker = async (stickerId: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/stickers/${stickerId}`);
}


