import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/apis/mutations/user/patchUser";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { UpdateMeRequest, UpdateMeResponse } from "@/types/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMeResponse, ApiError<ApiErrorBody>, UpdateMeRequest>(
    {
      mutationFn: (data) => updateUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
};
