import axios from "axios";
import type { UploadPartRequest, UploadPartResponse } from "@/types/file";

export const uploadPart = async ({
  presignedUrl,
  chunk,
  onProgress,
}: UploadPartRequest): Promise<UploadPartResponse> => {
  const response = await axios.put(presignedUrl, chunk, {
    onUploadProgress: (event) => {
      if (event.loaded && onProgress) {
        onProgress(event.loaded);
      }
    },
  });

  const etag = response.headers["etag"];
  if (etag) {
    return { etag: etag.replace(/"/g, "") };
  }
  throw new Error("ETag not found in response");
};
