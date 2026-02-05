import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EditableTitle from "@/components/common/EditableTitle";
import { BtnIcon } from "@/components/common/Button/Btn";
import Pagination from "@/components/common/Pagination";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import { Pencil, X, Camera } from "lucide-react";
import TrashIcon from "@/assets/icon/TrashIcon";
import { useFileUpload } from "@/hooks/useFileUpload";

import { useGetGallery } from "@/apis/queries/gallery/useGetGallery";
import { useDeleteGallery } from "@/apis/mutations/gallery/useDeleteGallery";
import { useUpdateGallery } from "@/apis/mutations/gallery/usePatchGalleryTitle";
import { useAddGallery } from "@/apis/mutations/gallery/usePostGallery";

const PER_PAGE = 9;
const MAX_UPLOAD = 10;

export default function Gallery() {
  const { archiveId: archiveIdParam } = useParams<{ archiveId: string }>();
  const archiveId = archiveIdParam ? archiveIdParam : undefined;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [title, setTitle] = useState<string>("갤러리명 (사용자 지정)");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [thumbnailLoaded, setThumbnailLoaded] = useState<
    Record<string, boolean>
  >({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFiles } = useFileUpload();

  // React Query 훅들
  const { data, isLoading, isError } = useGetGallery({
    archiveId: archiveId ?? "",
    page: Math.max(0, page - 1),
    size: PER_PAGE,
  });

  const { mutateAsync: deleteGallery, isPending: isDeleting } =
    useDeleteGallery();
  const { mutateAsync: updateGalleryTitle } = useUpdateGallery();
  const { mutateAsync: addGallery, isPending: isAdding } = useAddGallery();

  // 서버 응답 기반 photos
  const photos = useMemo(() => {
    return (data?.content ?? []).map((it: any) => {
      const id = String(it.id ?? it.fileId);
      // thumbnailUrl이 로드 완료되면 사용, 아니면 originalUrl 사용
      const url =
        it.thumbnailUrl && thumbnailLoaded[id]
          ? it.thumbnailUrl
          : (it.originalUrl ?? it.thumbnailUrl ?? "");
      return { id, url, fileName: it.fileName ?? undefined };
    });
  }, [data?.content, thumbnailLoaded]);

  // thumbnailUrl 백그라운드 프리로드 (3초마다 재시도)
  useEffect(() => {
    if (!data?.content) return;

    const tryLoadThumbnails = () => {
      data.content.forEach((item: any) => {
        const id = String(item.id ?? item.fileId);
        const thumbnailUrl = item.thumbnailUrl;

        if (!thumbnailUrl || thumbnailLoaded[id]) return;

        const img = new Image();
        img.onload = () => {
          setThumbnailLoaded((prev) => ({ ...prev, [id]: true }));
        };
        img.src = thumbnailUrl;
      });
    };

    // 즉시 시도
    tryLoadThumbnails();

    // 로드 안 된 썸네일이 있으면 3초마다 재시도
    const hasPending = data.content.some((item: any) => {
      const id = String(item.id ?? item.fileId);
      return item.thumbnailUrl && !thumbnailLoaded[id];
    });

    if (hasPending) {
      const interval = setInterval(tryLoadThumbnails, 3000);
      return () => clearInterval(interval);
    }
  }, [data?.content, thumbnailLoaded]);

  const totalElements = Number(data?.page?.totalElements ?? photos.length);
  const totalPages = Math.max(1, Math.ceil(totalElements / PER_PAGE));

  // EditableTitle 초기값 동기화 (첫 로드 시만)
  useEffect(() => {
    if (data?.title && title === "갤러리명 (사용자 지정)") {
      setTitle(data.title);
    }
  }, [data?.title]);

  // 페이지 변경 핸들러
  const loadPage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p));
    setSearchParams({ page: String(next) });
  };

  // 체크 토글
  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: checked }));
  };

  const checkedIds = useMemo(
    () => Object.keys(checkedMap).filter((k) => checkedMap[k]),
    [checkedMap]
  );

  // 제목 저장 (patch)
  const handleSaveName = async (nextName: string) => {
    setTitle(nextName);
    if (!archiveId) return;

    try {
      await updateGalleryTitle({
        archiveId,
        title: nextName,
      });
    } catch (e) {
      console.error("제목 수정 실패:", e);
    }
  };

  // 삭제 처리
  const handleDeleteSelected = async () => {
    if (checkedIds.length === 0) {
      alert("삭제할 사진을 선택하세요.");
      return;
    }
    if (!confirm(`${checkedIds.length}개의 사진을 삭제하시겠어요?`)) return;
    if (!archiveId) {
      alert("아카이브 정보가 없습니다.");
      return;
    }

    try {
      const galleryIds = checkedIds
        .map((id) => Number(id))
        .filter((n) => Number.isFinite(n));

      await deleteGallery({
        archiveId,
        galleryIds,
      });

      setCheckedMap({});
      setIsEditing(false);

      // 삭제 후 현재 페이지가 유효한지 체크
      const newTotal = totalElements - galleryIds.length;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / PER_PAGE));
      if (page > newTotalPages) {
        setSearchParams({ page: "1" });
      }
    } catch (err) {
      console.error("갤러리 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 파일 입력 트리거
  const onClickAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, MAX_UPLOAD);
    if (files.length > MAX_UPLOAD) {
      alert(`한 번에 최대 ${MAX_UPLOAD}장만 업로드할 수 있습니다.`);
    }
    if (!archiveId) {
      alert("아카이브 정보가 없습니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      // 1) 파일 업로드
      const uploadResults = await uploadFiles({
        files,
        mediaRole: "CONTENT" as any,
      });
      if (!uploadResults) throw new Error("파일 업로드 실패");

      // 2) fileIds 추출
      const fileIds = uploadResults
        .map((r) =>
          typeof r.fileId === "number" ? r.fileId : Number(r.fileId)
        )
        .filter((id) => Number.isFinite(id));

      if (fileIds.length === 0) throw new Error("유효한 fileId가 없습니다.");

      // 3) 갤러리에 등록 (invalidateQueries 자동 처리)
      await addGallery({
        archiveId,
        fileIds,
      });
    } catch (err: any) {
      console.error("업로드/등록 실패:", err);
      alert(err?.message ?? "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 로딩 UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-310">
          <div className="my-15">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mt-5 mb-15">
            <div className="grid grid-cols-3 gap-x-20 gap-y-15 w-310">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="w-90 h-75 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 UI
  if (isError) return <div>갤러리 로드 중 오류가 발생했습니다.</div>;

  // 빈 상태 UI
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-310">
          <div className="my-15">
            <EditableTitle
              value={title}
              onSave={handleSaveName}
              placeholder="갤러리명을 입력하세요."
              maxLength={50}
            />
          </div>
          <EmptyList
            title="사진 추가"
            description="사진을 추가해서 덕질 기록을 남겨보세요."
            onClick={onClickAddPhotos}
            startIcon={<Camera className="w-6 h-6 text-color-high" />}
            className="w-full h-135"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesSelected}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // 사진 있을 때 UI
  return (
    <div className="flex flex-col items-center">
      <div className="w-310">
        <div className="my-15">
          <EditableTitle value={title} onSave={handleSaveName} />
        </div>
        <div className="flex justify-end gap-5 mb-10">
          {!isEditing && (
            <BtnIcon
              onClick={onClickAddPhotos}
              startIcon={<Camera className="size-6 text-color-high" />}
              disabled={isAdding}
              className={isAdding ? "opacity-60 cursor-not-allowed" : ""}
            >
              {isAdding ? "업로드 중..." : "사진 추가"}
            </BtnIcon>
          )}
          {isEditing && (
            <BtnIcon
              onClick={handleDeleteSelected}
              startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
              disabled={isDeleting}
            >
              삭제하기
            </BtnIcon>
          )}
          <BtnIcon
            onClick={() => {
              setIsEditing((s) => {
                if (s) setCheckedMap({});
                return !s;
              });
            }}
            startIcon={
              isEditing ? (
                <X className="size-6 text-color-high" />
              ) : (
                <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
              )
            }
          >
            {isEditing ? "취소하기" : "편집하기"}
          </BtnIcon>
        </div>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-3 gap-x-20 gap-y-15 mb-15 w-310">
        {photos.map((p) => (
          <div key={p.id} className="relative group">
            <div className="w-90 h-75 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
              {p.url ? (
                <img
                  src={p.url}
                  alt={p.fileName ?? "photo"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
            {isEditing && (
              <label className="absolute left-3 top-3">
                <input
                  type="checkbox"
                  checked={!!checkedMap[p.id]}
                  onChange={(e) => toggleCheck(p.id, e.target.checked)}
                  className="sr-only"
                />
                <CheckboxIcon checked={!!checkedMap[p.id]} size={24} />
              </label>
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mb-12">
        <Pagination
          totalItems={totalElements}
          pageSize={PER_PAGE}
          visiblePages={5}
          currentPage={page}
          onChange={loadPage}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFilesSelected}
        className="hidden"
      />
    </div>
  );
}
