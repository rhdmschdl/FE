import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "@/apis/mutations/ticket/deleteTicket";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { DeleteTicketRequest, DeleteTicketResponse } from "@/types/ticket";

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteTicketResponse,
    ApiError<ApiErrorBody>,
    DeleteTicketRequest
  >({
    mutationFn: (data) => deleteTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.ticketBook.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
