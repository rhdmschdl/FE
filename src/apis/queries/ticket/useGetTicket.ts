import { useQuery } from "@tanstack/react-query";
import { getTicket, getTicketBook } from "@/apis/queries/ticket/getTicket";
import { queryKeys } from "@/constants/queryKeys";
import type {
  GetTicketRequest,
  GetTicketResponse,
  GetTicketBookRequest,
  GetTicketBookResponse,
} from "@/types/ticket";

export const useGetTicket = (params: GetTicketRequest) => {
  return useQuery<GetTicketResponse>({
    queryKey: queryKeys.ticket.detail(params.ticketId),
    queryFn: () => getTicket(params),
    enabled: !!params.ticketId,
    retry: false,
  });
};

export const useGetTicketBook = (params: GetTicketBookRequest) => {
  return useQuery<GetTicketBookResponse>({
    queryKey: [
      ...queryKeys.ticketBook.detail(params.archiveId),
      params.page,
      params.size,
      params.sort,
      params.direction,
    ],
    queryFn: () => getTicketBook(params),
    enabled: !!params.archiveId,
    retry: false,
  });
};
