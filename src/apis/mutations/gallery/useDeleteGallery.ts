import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGallery } from "./deleteGallery";
import { queryKeys } from "@/constants/queryKeys";
import type { ApiError, ApiErrorBody } from "@/types/error";
import type {
  DeleteGalleryRequest,
  DeleteGalleryResponse,
} from "@/types/gallery";

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteGalleryResponse,
    ApiError<ApiErrorBody>,
    DeleteGalleryRequest
  >({
    mutationFn: (data) => deleteGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
