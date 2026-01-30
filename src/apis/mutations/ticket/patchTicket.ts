import axiosInstance from "@/apis/axios";
import type {
  UpdateTicketBookRequest,
  UpdateTicketBookResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from "@/types/ticket";

export const updateTicket = async (
  data: UpdateTicketRequest
): Promise<UpdateTicketResponse> => {
  const { ticketId, ...body } = data;
  const response = await axiosInstance.patch<UpdateTicketResponse>(
    `/api/v1/tickets/${ticketId}`,
    body
  );
  return response.data;
};

export const updateTicketBook = async (
  data: UpdateTicketBookRequest
): Promise<UpdateTicketBookResponse> => {
  const { archiveId, title } = data;
  const response = await axiosInstance.patch<UpdateTicketBookResponse>(
    `/api/v1/tickets/book/${archiveId}`,
    {
      title,
    }
  );
  return response.data;
};
