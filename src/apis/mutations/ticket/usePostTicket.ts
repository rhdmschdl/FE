import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTicket } from "@/apis/mutations/ticket/postTicket";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { AddTicketRequest, AddTicketResponse } from "@/types/ticket";

export const useAddTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddTicketResponse,
    ApiError<ApiErrorBody>,
    AddTicketRequest
  >({
    mutationFn: (data) => addTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.ticketBook.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
