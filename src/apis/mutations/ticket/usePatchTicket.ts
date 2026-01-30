import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTicket,
  updateTicketBook,
} from "@/apis/mutations/ticket/patchTicket";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  UpdateTicketBookRequest,
  UpdateTicketBookResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from "@/types/ticket";

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTicketResponse,
    ApiError<ApiErrorBody>,
    UpdateTicketRequest
  >({
    mutationFn: (data) => updateTicket(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ticketBook.all });
      queryClient.setQueryData(
        queryKeys.ticket.detail(variables.ticketId),
        data
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateTicketBook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateTicketBookResponse,
    ApiError<ApiErrorBody>,
    UpdateTicketBookRequest
  >({
    mutationFn: (data) => updateTicketBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ticketBook.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
