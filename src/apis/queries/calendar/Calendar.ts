import axiosInstance from "@/apis/axios";
import type { EventResponse, StickerResponse } from "@/types/calendar";

export const getMonthlyEvents = async (archiveId: number, year: number, month: number): Promise<EventResponse[]> => {
  const response = await axiosInstance.get(`/api/v1/events/monthly/${archiveId}`, {
    params: {
      year,
      month,
    },
  });
  return response.data;
};

export const getMonthlyStickers = async (archiveId: number, year: number, month: number): Promise<StickerResponse[]> => {
  const response = await axiosInstance.get(`/api/v1/stickers/monthly/${archiveId}`, {
    params: {
      year,
      month,
    },
  });
  return response.data;
};