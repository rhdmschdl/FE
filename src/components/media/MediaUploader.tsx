import { useRef, useState, useEffect } from "react";
import ImgUpLoadCard from "../common/Card/ImgUpLoadCard";
import MediaCarousel from "./MediaCarousel";
import { MediaType } from "@/enums/mediaType";
import type { MediaItem } from "@/types/media";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MediaRole } from "@/enums/mediaRole";
import { MimeType } from "@/enums/mimeType";
import { UploadStatus } from "@/enums/uploadStatus";
import { abort as abortUploadApi } from "@/apis/mutations/file/postFile";

export default function MediaUploader({
  maxImages = 10,
  maxVideos = 1,
  onChange,
}: {
  maxImages?: number;
  maxVideos?: number;
  onChange?: (items: MediaItem[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { cancel: cancelCurrentUpload } = useFileUpload({});
  const { uploadFiles } = useFileUpload();

  // 선택 아이템과 대표 여부
  const selectedItem = items.find((i) => i.id === selectedId) ?? null;
  const isSelectedRepresentative = !!selectedItem?.isRepresentative;

  // layout 상수
  const FIXED_WINDOW = 1240;
  const UPLOAD_CARD_WIDTH = 360;
  const GAP = 20;
  const carouselWindowWidth = Math.max(
    360,
    FIXED_WINDOW - UPLOAD_CARD_WIDTH - GAP
  );

  useEffect(() => {
    if (selectedId && !items.some((i) => i.id === selectedId)) {
      setSelectedId(null);
    }

    const existingRep = items.find((i) => i.isRepresentative);
    if (existingRep) return;

    // 대표가 없고 items가 비어있지 않다면 자동 지정: 첫 항목을 대표로
    if (items.length > 0) {
      const next = items.map((it, idx) => ({
        ...it,
        isRepresentative: idx === 0,
      }));
      setItems(next);
      onChange?.(next);
    }
  }, [items]);

  const openPicker = () => fileInputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    // 현재 items에서 이미지/비디오 개수 계산
    const existingImages = items.filter(
      (it) => it.mediaType === MediaType.IMAGE
    ).length;
    const existingVideos = items.filter(
      (it) => it.mediaType === MediaType.VIDEO
    ).length;

    const filesArray = Array.from(files);

    // 분류: 이미지들, 비디오들
    const imagesToAdd: File[] = [];
    const videosToAdd: File[] = [];

    for (const f of filesArray) {
      if (f.type.startsWith("image/")) imagesToAdd.push(f);
      else if (f.type.startsWith("video/")) videosToAdd.push(f);
      else {
        // 지원하지 않는 파일 형식이면 무시(원하면 알림 추가)
        console.warn("지원하지 않는 파일 형식 무시:", f.name);
      }
    }

    // 허용 가능한 추가 개수 계산
    const remainingImageSlots = Math.max(0, (maxImages ?? 10) - existingImages);
    const remainingVideoSlots = Math.max(0, (maxVideos ?? 1) - existingVideos);

    // 선택된 비디오가 이미 있고 추가 비디오가 있으면 모두 무시
    let acceptedImages: File[] = [];
    let acceptedVideos: File[] = [];

    if (videosToAdd.length > 0) {
      if (existingVideos >= (maxVideos ?? 1)) {
        // 이미 비디오가 존재: 추가 비디오는 모두 무시
        // 사용자 안내
        alert(
          `비디오는 최대 ${
            maxVideos ?? 1
          }개만 허용됩니다. 이미 비디오가 등록되어 있습니다.`
        );
        acceptedVideos = [];
      } else {
        // 비디오 슬롯이 있으면 슬롯 수만큼만 허용 (보통 1개)
        acceptedVideos = videosToAdd.slice(0, remainingVideoSlots);
        if (videosToAdd.length > acceptedVideos.length) {
          alert(
            `비디오는 최대 ${
              maxVideos ?? 1
            }개만 허용됩니다. 초과된 비디오는 업로드에서 제외됩니다.`
          );
        }
      }
    }

    // 이미지는 슬롯 수만큼 허용
    if (imagesToAdd.length > 0) {
      if (remainingImageSlots <= 0) {
        alert(
          `이미지(사진)는 최대 ${
            maxImages ?? 10
          }장까지 업로드할 수 있습니다. 추가된 이미지는 제외됩니다.`
        );
        acceptedImages = [];
      } else {
        acceptedImages = imagesToAdd.slice(0, remainingImageSlots);
        if (imagesToAdd.length > acceptedImages.length) {
          alert(
            `이미지 업로드 개수가 최대(${
              maxImages ?? 10
            })를 초과하여 일부 파일은 제외됩니다.`
          );
        }
      }
    }

    // 합친 업로드 대상
    const acceptedFiles = [...acceptedImages, ...acceptedVideos];
    if (acceptedFiles.length === 0) {
      // 업로드할 파일 없음 -> 끝
      return;
    }

    // 준비: 새로 추가할 uploads 배열
    const startIndex = items.length;
    const uploads: MediaItem[] = acceptedFiles.map((file, i) => {
      const isImage = file.type.startsWith("image/");
      const id = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const seq = startIndex + i;
      return {
        id,
        url: URL.createObjectURL(file),
        role: MediaRole.CONTENT,
        mediaType: isImage ? MediaType.IMAGE : MediaType.VIDEO,
        mimeType: (file.type as MimeType) ?? undefined,
        isRepresentative: false,
        sequence: seq,
        uploadStatus: UploadStatus.IDLE,
        file,
      } as MediaItem;
    });

    // preview에 즉시 추가
    const nextPreview = [...items, ...uploads];
    setItems(nextPreview);
    onChange?.(nextPreview);

    // 실제 업로드 호출
    try {
      const result = await uploadFiles({
        files: acceptedFiles,
        mediaRole: MediaRole.CONTENT,
      });

      if (!result) {
        const failed = nextPreview.map((it) =>
          uploads.some((u) => u.id === it.id)
            ? { ...it, uploadStatus: UploadStatus.ERROR }
            : it
        );
        setItems(failed);
        onChange?.(failed);
        alert("파일 업로드에 실패했습니다.");
        return;
      }

      // 업로드 성공 시 매핑
      const updated = nextPreview.map((it) => {
        const uploadIndex = uploads.findIndex((u) => u.id === it.id);
        if (uploadIndex === -1) return it;
        const r = result[uploadIndex] as any;
        return {
          ...it,
          serverId: r.fileId ?? r.id ?? undefined,
          url: r.cdnUrl ?? it.url,
          mimeType: (r.mimeType as MimeType) ?? it.mimeType,
          uploadStatus: UploadStatus.SUCCESS,
          sequence: typeof r.sequence === "number" ? r.sequence : it.sequence,
        } as MediaItem;
      });

      setItems(updated);
      onChange?.(updated);

      console.log("upload result:", result);
      console.log("updated items after upload:", updated);
    } catch (e) {
      console.error("uploadFiles error", e);
      const failed = nextPreview.map((it) =>
        uploads.some((u) => u.id === it.id)
          ? { ...it, uploadStatus: UploadStatus.ERROR }
          : it
      );
      setItems(failed);
      onChange?.(failed);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const handleRemove = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    try {
      URL.revokeObjectURL(target.url);
    } catch (e) {}

    const isUploading =
      target.uploadStatus === UploadStatus.INITIATING ||
      target.uploadStatus === UploadStatus.UPLOADING ||
      target.uploadStatus === UploadStatus.COMPLETING ||
      Boolean((target as any).uploadInfo);

    if (isUploading) {
      try {
        const uploadInfo = (target as any).uploadInfo;
        if (uploadInfo?.key && uploadInfo?.uploadId) {
          await abortUploadApi({
            key: uploadInfo.key,
            uploadId: uploadInfo.uploadId,
          });
        }

        try {
          cancelCurrentUpload?.();
        } catch (e) {}
      } catch (e) {
        console.error("업로드 중단 실패:", e);
      }
    }

    const next = items.filter((i) => i.id !== id);
    const removedWasRep = target?.isRepresentative;
    let adjusted = next;
    if (removedWasRep && next.length > 0) {
      adjusted = next.map((it, idx) => ({
        ...it,
        isRepresentative: idx === 0,
      }));
    }

    setItems(adjusted);
    if (selectedId === id) setSelectedId(null);
    onChange?.(adjusted);
  };

  const handleSelectCard = (id: string) => {
    setSelectedId((prev) => (prev === id ? prev : id));
  };

  // 체크박스 클릭: 선택된 카드가 대표로 바뀌게 items 갱신
  const handleToggleRepresentative = (checked: boolean) => {
    if (!selectedId) {
      alert("대표로 지정할 미디어를 먼저 클릭해 주세요.");
      return;
    }

    const selected = items.find((i) => i.id === selectedId);
    if (!selected) {
      alert("선택된 항목을 찾을 수 없습니다.");
      return;
    }

    // 사용자가 직접 지정하는 경우 이미지 전용 제한을 두지 않음
    const next = items.map((i) => ({
      ...i,
      isRepresentative: checked ? i.id === selectedId : false,
    }));
    setItems(next);
    onChange?.(next);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          if (e.target) e.target.value = "";
        }}
      />

      <div className="flex justify-center">
        {/* 고정 영역(1240px) */}
        <div style={{ width: `${FIXED_WINDOW}px` }}>
          <div className="flex items-start" style={{ gap: `${GAP}px` }}>
            {/* 업로드 카드: 고정폭 유지 */}
            <div style={{ width: `${UPLOAD_CARD_WIDTH}px`, flex: "0 0 auto" }}>
              <ImgUpLoadCard onClick={openPicker} />
            </div>

            {/* 캐러셀: 남는 폭만 사용, (버튼은 밖에 absolute로 배치) */}
            <div
              style={{ flex: "1 1 auto", width: `${carouselWindowWidth}px` }}
            >
              {items.length > 0 && (
                <MediaCarousel
                  items={items}
                  onRemove={handleRemove}
                  onCardClick={handleSelectCard}
                  selectedId={selectedId}
                  cardWidth={360}
                  gap={GAP}
                  windowWidth={carouselWindowWidth}
                  prevOffset={-450}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 typo-caption text-color-high">
        사진은 최대 {maxImages}장까지 등록할 수 있어요. (예 : 권장사이즈
        360*180)
      </div>

      {/* 대표 체크박스 */}
      {items.length >= 2 && selectedId && (
        <div className="mt-3 flex items-center typo-body1 text-color-highest">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelectedRepresentative}
              onChange={(e) => handleToggleRepresentative(e.target.checked)}
              className="size-6 appearance-none rounded-sm bg-low
              checked:bg-primary checked:bg-[url('https://icnlbuaakhminucvvzcj.supabase.co/storage/v1/object/public/assets/checkbox.png')]
              bg-md bg-no-repeat bg-center "
            />
            <span>대표 이미지로 설정</span>
          </label>
        </div>
      )}
    </div>
  );
}
