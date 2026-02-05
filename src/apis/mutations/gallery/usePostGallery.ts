import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGallery } from "./postGallery";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type { AddGalleryRequest, AddGalleryResponse } from "@/types/gallery";

export const useAddGallery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AddGalleryResponse,
    ApiError<ApiErrorBody>,
    AddGalleryRequest
  >({
    mutationFn: (data) => addGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
