import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EditableTitle from "@/components/common/EditableTitle";
import { BtnIcon } from "@/components/common/Button/Btn";
import Pagination from "@/components/common/Pagination";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import { v4 as uuidv4 } from "uuid";
import { Pencil, X, Camera } from "lucide-react";
import TrashIcon from "@/assets/icon/TrashIcon";
import fetchGallery from "@/apis/queries/gallery/getGallery";
import registerGalleryApi from "@/apis/mutations/gallery/registerGallery";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MediaRole } from "@/enums/mediaRole";
import type { FileCompleteResponse } from "@/types/file";
import deleteGalleryApi from "@/apis/mutations/gallery/deleteGallery";
import ImageWithSkeleton from "@/components/gallery/ImageWithSkeleton";
import updateGalleryTitleApi from "@/apis/mutations/gallery/updateGalleryTitle";

type Photo = {
  id: string;
  url: string;
  fileName?: string;
  createdAt?: string;
  isNew?: boolean;
};

type GalleryResp = {
  content?: any[];
  page?: { totalPages?: number; totalElements?: number };
  title?: string;
};

const PER_PAGE = 9;
const MAX_UPLOAD = 10;

export default function Gallery() {
  const { archiveId } = useParams<{ archiveId: string }>();
  const [title, setTitle] = useState<string>("");
  const [, setIsSaving] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUploading] = useState(false); //setIsUploading
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [, setIsLoading] = useState<boolean>(false);
  const [, setLoadError] = useState<string | null>(null);

  const { uploadFiles } = useFileUpload();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdUrlsRef = useRef<Set<string>>(new Set());
  const controllerRef = useRef<AbortController | null>(null);

  // 갤러리명 저장
  const handleSaveName = async (nextName: string) => {
    setTitle(nextName);

    // archiveId 검사
    if (!archiveId) {
      alert("아카이브 ID가 없습니다.");
      return;
    }

    try {
      setIsSaving(true);
      const idForApi = Number.isFinite(Number(archiveId))
        ? Number(archiveId)
        : String(archiveId);

      await updateGalleryTitleApi(idForApi, { title: nextName });

      // 성공 시 목록 새로고침
      await loadServerPage(1);
    } catch (err: any) {
      alert(
        "저장 실패: " +
          (err?.response?.data?.message ?? err?.message ?? "서버 오류")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const currentPhotos = photos;

  // 파일 입력 트리거
  const onClickAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelectedForRegister = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.currentTarget.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, MAX_UPLOAD);
    if (files.length > MAX_UPLOAD) {
      alert(
        `한 번에 최대 ${MAX_UPLOAD}장만 업로드할 수 있습니다. 처음 ${MAX_UPLOAD}장만 처리됩니다.`
      );
    }

    if (!archiveId) {
      alert("아카이브 정보가 없습니다.");
      e.currentTarget.value = "";
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      // 1) 병렬 업로드
      const uploadResults = await uploadFiles({
        files,
        mediaRole: MediaRole.CONTENT,
      });

      if (!uploadResults) {
        throw new Error(
          "파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      }

      const newItems = (uploadResults as FileCompleteResponse[]).map((r) => ({
        id: `tmp-${r.fileId ?? Math.random().toString(36).slice(2)}`,
        url: r.cdnUrl ?? "",
        fileName: r.filename ?? "",
        isNew: true, // 새 항목 플래그
      }));

      // 옵티미스틱으로 UI에 즉시 반영
      setPhotos((prev) => [...newItems, ...prev]);

      // 2) 업로드 응답에서 fileId 추출
      const fileIds = (uploadResults as FileCompleteResponse[])
        .map((r) => {
          return typeof r.fileId === "number" ? r.fileId : NaN;
        })
        .filter((n): n is number => Number.isFinite(n)); // 타입 가드로 number[] 보장

      if (fileIds.length === 0) {
        throw new Error("서버에서 유효한 fileId를 받지 못했습니다.");
      }

      // 3) 갤러리 등록 API 호출
      await registerGalleryApi(archiveId, { fileIds });
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      // 4) 성공 처리: 갤러리 재로딩
      await loadServerPage(1);
    } catch (err: any) {
      console.error("업로드/등록 실패:", err);
      alert(
        err?.response?.data?.message ??
          err?.message ??
          "이미지 업로드 또는 등록 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
      // input 초기화
      e.currentTarget.value = "";
    }
  };

  // 체크 토글
  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: checked }));
  };

  // 체크된 id 배열
  const checkedIds = useMemo(
    () => Object.keys(checkedMap).filter((k) => checkedMap[k]),
    [checkedMap]
  );

  // 삭제
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

    setIsLoading(true);
    const prevPhotos = photos;
    const prevTotal = totalElements;
    const prevPage = page;

    try {
      // 1) 서버로 보낼 numericIds 계산
      const idsToDelete = checkedIds.map((id) => {
        const num = Number(id);
        return Number.isNaN(num) ? id : num;
      });
      const numericIds = idsToDelete
        .map((x) => (typeof x === "number" ? x : Number(x)))
        .filter((v) => !Number.isNaN(v)) as number[];

      // 2) UI 즉시 반영
      setPhotos((prev) =>
        prev.filter((p) => {
          if (numericIds.length > 0 && numericIds.includes(Number(p.id)))
            return false;
          if (checkedIds.includes(p.id)) return false;
          return true;
        })
      );

      // 2.1) 클라이언트에서 기대되는 total / totalPages 계산
      const expectedTotal = Math.max(0, totalElements - checkedIds.length);
      const expectedTotalPages = Math.max(
        1,
        Math.ceil(expectedTotal / PER_PAGE)
      );

      // 3) 서버 삭제 호출
      if (numericIds.length > 0) {
        await deleteGalleryApi(archiveId, { galleryIds: numericIds });
      }

      // 4) 보정할 targetPage 결정 및 상태 먼저 반영
      const targetPage = page > expectedTotalPages ? expectedTotalPages : page;
      setPage(targetPage);

      // 5) 안전 로드 함수: PAGE_NOT_FOUND / 404 나오면 이전 페이지로 내려가 재시도
      const safeLoad = async (p: number): Promise<boolean> => {
        try {
          // loadServerPage가 내부에서 예외를 throw 하면 catch로 옴
          await loadServerPage(p);
          return true;
        } catch (err: any) {
          const errCode =
            err?.response?.data?.error ??
            err?.response?.data?.status ??
            err?.message;
          const statusCode = err?.response?.status;

          // PAGE_NOT_FOUND 또는 HTTP 404 처리: 이전 페이지로 내려가 재시도
          if (errCode === "PAGE_NOT_FOUND" || statusCode === 404) {
            if (p > 1) {
              return await safeLoad(p - 1);
            } else {
              // 더 내려갈 곳 없으면 1페이지 시도
              try {
                await loadServerPage(1);
                setPage(1);
                return true;
              } catch (innerErr) {
                console.error("safeLoad: 1페이지 로드 실패:", innerErr);
                return false;
              }
            }
          }

          // 그 외 에러: 로깅 후 false 반환 (호출자에서 처리)
          console.error("safeLoad non-PAGE_NOT_FOUND error:", err);
          return false;
        }
      };

      // 6) 호출: targetPage로 안전 로드 시도
      const loadOk = await safeLoad(targetPage);
      if (!loadOk) {
        // 안전 로드 실패 시 롤백
        setPhotos(prevPhotos);
        setTotalElements(prevTotal);
        setPage(prevPage);
        alert(
          "목록을 갱신하는 동안 문제가 발생했습니다. 새로고침 후 다시 시도해주세요."
        );
        return;
      }

      // 7) 체크맵에서 삭제된 id 제거
      setCheckedMap((prev) => {
        const next = { ...prev };
        checkedIds.forEach((cid) => delete next[cid]);
        return next;
      });

      setIsEditing(false);
    } catch (err: any) {
      console.error("갤러리 삭제 실패:", err);
      // 롤백
      setPhotos(prevPhotos);
      setTotalElements(prevTotal);
      setPage(prevPage);

      alert(
        err?.response?.data?.message ??
          err?.message ??
          "삭제 중 오류가 발생했습니다."
      );

      try {
        await loadServerPage(prevPage);
      } catch (e) {
        console.error("복구 시 목록 재조회 실패:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 이동
  const loadPage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages || 1, p));
    setPage(next);
  };

  // 컴포넌트 언마운트 시 생성한 blob URL 해제
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      createdUrlsRef.current.clear();
      controllerRef.current?.abort();
    };
  }, []);

  const loadServerPage = async (page1: number): Promise<GalleryResp | null> => {
    if (!archiveId) return null;
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setIsLoading(true);
    setLoadError(null);

    try {
      const resp = await fetchGallery(
        { archiveId, page: page1 - 1, size: PER_PAGE },
        controllerRef.current.signal
      );

      if (resp.title) setTitle(resp.title);

      const items: Photo[] = (resp.content ?? []).map((it: any) => ({
        id: String(it.id ?? it.fileId ?? uuidv4()),
        url: it.thumbnailUrl ?? (it.url as string | undefined) ?? "",
        fileName: it.fileName ?? it.name ?? undefined,
        createdAt: it.createdAt ?? it.lastModifiedAt ?? undefined,
        isNew: false,
      }));

      // 서버값 기준으로 상태 업데이트
      setPhotos(items);
      const totalPagesFromResp = Number(resp.page?.totalPages ?? 1);
      const totalElementsFromResp = Number(
        resp.page?.totalElements ?? items.length
      );
      setTotalPages(totalPagesFromResp);
      setTotalElements(totalElementsFromResp);

      return resp as GalleryResp;
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        return null;
      }
      console.error("fetchGallery error:", err);
      setLoadError(err?.message ?? "갤러리 로드 실패");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  // archiveId나 page가 바뀌면 서버 호출
  useEffect(() => {
    loadServerPage(page);
  }, [archiveId, page]);

  // 빈 상태 렌더링
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-310">
          <div className="my-15 ">
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
          {/* 숨겨진 파일 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesSelectedForRegister}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // non-empty (사진이 있을 때)
  return (
    <div className="flex flex-col items-center">
      <div className="w-310">
        <div className="my-15">
          <EditableTitle value={title} onSave={handleSaveName} />
        </div>
        {photos.length > 0}
        <div className="flex justify-end gap-5 mb-10">
          {!isEditing && (
            <BtnIcon
              onClick={onClickAddPhotos}
              startIcon={<Camera className="size-6 text-color-high" />}
              disabled={isUploading}
              className={isUploading ? "opacity-60 cursor-not-allowed" : ""}
            >
              {isUploading ? "업로드 중..." : "사진 추가"}
            </BtnIcon>
          )}
          {isEditing && (
            <BtnIcon
              onClick={handleDeleteSelected}
              startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
            >
              삭제하기
            </BtnIcon>
          )}
          <BtnIcon
            onClick={() => {
              setIsEditing((s) => {
                const next = !s;
                if (!next) setCheckedMap({});
                return next;
              });
            }}
            startIcon={
              isEditing ? (
                <X className="w-6 h-6 text-color-high" />
              ) : (
                <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
              )
            }
          >
            {isEditing ? "취소하기" : "편집하기"}
          </BtnIcon>
        </div>
      </div>

      {/* 이미지 그리드 (3열 x 3행) */}
      <div className="grid grid-cols-3 gap-x-20 gap-y-15 mb-15 w-310">
        {currentPhotos.map((p) => (
          <div key={p.id} className="relative group">
            <div className="w-90 h-75 rounded-lg flex items-center justify-center overflow-hidden">
              <ImageWithSkeleton
                src={p.url}
                alt={p.fileName ?? "photo"}
                className="w-full h-full"
                maxRetries={2}
                retryIntervalMs={700}
              />
            </div>

            {/* 편집 체크박스*/}
            {isEditing && (
              <label className="absolute left-3 top-3">
                <input
                  type="checkbox"
                  checked={!!checkedMap[p.id]}
                  onChange={(e) => toggleCheck(p.id, e.target.checked)}
                  className="sr-only"
                  aria-label={checkedMap[p.id] ? "선택 해제" : "선택"}
                />
                <div>
                  <CheckboxIcon checked={!!checkedMap[p.id]} size={24} />
                </div>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* 페이징 & 상태 표시 */}
      <div className="flex justify-center mb-12">
        <Pagination
          totalItems={totalElements}
          pageSize={PER_PAGE}
          visiblePages={5}
          currentPage={Number(page)}
          onChange={(p) => loadPage(p)}
        />
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFilesSelectedForRegister}
        className="hidden"
      />
    </div>
  );
}
