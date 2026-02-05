import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGallery } from "./patchGalleryTitle";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  UpdateGalleryRequest,
  UpdateGalleryResponse,
} from "@/types/gallery";

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateGalleryResponse,
    ApiError<ApiErrorBody>,
    UpdateGalleryRequest
  >({
    mutationFn: (data) => updateGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
