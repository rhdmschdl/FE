import axiosInstance from "@/apis/axios";
import type { AddTicketRequest, AddTicketResponse } from "@/types/ticket";

export const addTicket = async (
  data: AddTicketRequest
): Promise<AddTicketResponse> => {
  const { archiveId, ...body } = data;
  const response = await axiosInstance.post<AddTicketResponse>(
    `/api/v1/tickets/${archiveId}`,
    body
  );
  return response.data;
};
