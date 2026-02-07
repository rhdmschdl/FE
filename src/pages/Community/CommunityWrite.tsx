import { useEffect, useMemo, useState } from "react";
import BackNavigator from "@/components/common/BackNavigator";
import RequiredLabel from "@/components/common/Form/RequiredLabel";
import TextField from "@/components/common/Form/TextField";
import MediaUploader from "@/components/media/MediaUploader";
import CommunityTab from "@/components/community/CommunityTab";
import { BtnBasic } from "@/components/common/Button/Btn";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/apis/mutations/community/useCreatePost";
import { MediaRole } from "@/enums/mediaRole";

export default function CommunityWrite() {
  const navigate = useNavigate();
  const { mutate: createPost, isPending } = useCreatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  // 에러 상태
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const TITLE_MAX = 50;
  const CONTENT_MAX = 5000;

  // 실시간 검증 (타이핑할 때마다)
  useEffect(() => {
    if (title.length > TITLE_MAX) {
      setTitleError("제목은 최대 50자까지 작성할 수 있어요.");
    } else {
      setTitleError(null);
    }
  }, [title]);

  useEffect(() => {
    if (content.length > CONTENT_MAX) {
      setContentError("본문은 최대 5,000자까지 작성할 수 있어요.");
    } else {
      setContentError(null);
    }
  }, [content]);

  // 다른 필수 체크
  const isCategoryValid = category !== "" && category !== "all";
  const isMediaValid = useMemo(() => {
    if (!mediaItems || mediaItems.length === 0) return false;

    const normalizeType = (t: any): "image" | "video" | undefined => {
      if (!t) return undefined;
      const s = String(t).toUpperCase();
      if (s.includes("IMAGE")) return "image";
      if (s.includes("VIDEO")) return "video";

      if (s.startsWith("IMAGE/")) return "image";
      if (s.startsWith("VIDEO/")) return "video";
      return undefined;
    };

    // 안전한 필드명 추출
    const normalized = mediaItems.map((m) => {
      const rawType = (m as any).mediaType ?? (m as any).type;
      return {
        ...m,
        _type: normalizeType(rawType),
        _isRep: !!(m as any).isRepresentative,
      };
    });

    // 항목이 하나이면(이미지든 비디오든) 유효
    if (normalized.length === 1) return true;

    // 복수 항목이면 반드시 대표가 하나 지정되어 있어야 유효
    return normalized.some((m) => m._isRep === true);
  }, [mediaItems]);

  const isTitleValid = useMemo(
    () => title.trim().length > 0 && title.length <= TITLE_MAX,
    [title]
  );
  const isContentValid = useMemo(
    () => content.trim().length > 0 && content.length <= CONTENT_MAX,
    [content]
  );

  // 전체 폼 유효성: 모든 필드가 유효하고 에러가 없을 때만 true
  const isFormValid = useMemo(() => {
    return (
      isTitleValid &&
      isContentValid &&
      !titleError &&
      !contentError &&
      isCategoryValid &&
      isMediaValid
    );
  }, [
    isTitleValid,
    isContentValid,
    titleError,
    contentError,
    isCategoryValid,
    isMediaValid,
  ]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // 업로드 미완료 확인
    const pending = mediaItems.some(
      (m: any) =>
        (m.uploadStatus && m.uploadStatus !== "SUCCESS") ||
        !(m.serverId ?? m.fileId ?? m.id)
    );
    if (pending) {
      alert(
        "미디어 업로드가 아직 완료되지 않았습니다. 완료 후 다시 시도해 주세요."
      );
      return;
    }

    // 1) 기본 매핑
    const mapped = mediaItems
      .map((m: any) => {
        const fileId = m.serverId ?? m.fileId ?? m.id ?? null;
        if (!fileId) return null;
        return {
          fileId,
          mediaRole: m.isRepresentative ? MediaRole.PREVIEW : MediaRole.CONTENT,
          sequence: typeof m.sequence === "number" ? m.sequence : undefined,
        };
      })
      .filter(Boolean) as {
      fileId: string | number;
      mediaRole: string;
      sequence?: number;
    }[];

    // 2) sequence 검증/정규화: 누락/중복이 있으면 mediaItems 순서대로 0,1,2...로 재할당
    const seqCounts = new Map<number, number>();
    mapped.forEach((f) => {
      if (typeof f.sequence === "number") {
        seqCounts.set(f.sequence, (seqCounts.get(f.sequence) ?? 0) + 1);
      }
    });

    const hasMissing = mapped.some((f) => typeof f.sequence !== "number");
    const hasDup = Array.from(seqCounts.values()).some((c) => c > 1);

    let filesFinal = mapped;
    if (hasMissing || hasDup) {
      // 재할당: mediaItems 순서(프론트에서 보여지는 순서)에 따라 재부여
      filesFinal = mediaItems
        .map((m: any, idx: number) => {
          const fileId = m.serverId ?? m.fileId ?? m.id ?? null;
          if (!fileId) return null;
          return {
            fileId,
            mediaRole: m.isRepresentative
              ? MediaRole.PREVIEW
              : MediaRole.CONTENT,
            sequence: idx,
          };
        })
        .filter(Boolean) as {
        fileId: string | number;
        mediaRole: string;
        sequence: number;
      }[];
    }

    // 검증: 길이 일치 여부
    if (filesFinal.length !== mediaItems.length) {
      alert(
        "업로드가 아직 완료되지 않았거나 fileId가 누락되었습니다. 업로드 상태를 확인해 주세요."
      );
      return;
    }

    const payload = { title, content, category, files: filesFinal };

    createPost(payload, {
      onSuccess: (resp) => {
        console.log("게시글 생성 성공:", resp);
        navigate("/community");
      },
      onError: (e) => {
        alert(e?.message ?? "게시글 생성 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <div>
      <div className="mb-10">
        <BackNavigator label="커뮤니티 보기" onClick={() => history.back()} />
      </div>
      <div className="flex justify-center">
        <div className="max-w-310 flex flex-col gap-10">
          <div>
            <RequiredLabel required>미디어</RequiredLabel>
            <MediaUploader onChange={(items) => setMediaItems(items)} />
          </div>

          <div>
            <RequiredLabel required>카테고리</RequiredLabel>
            <CommunityTab value={category} onChange={setCategory} hideAll />
          </div>

          <div>
            <RequiredLabel required>제목</RequiredLabel>
            <TextField
              id="post-title"
              value={title}
              onChange={setTitle}
              placeholder="커뮤니티 게시물의 제목을 작성해주세요."
              maxLength={TITLE_MAX}
              showCount
              multiline={false}
              error={titleError}
            />

            {/* 제목 에러 문구 */}
            <div aria-live="polite">
              {titleError ? (
                <p className="typo-caption mt-3 text-[#FF0000]">{titleError}</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>

          <div>
            <RequiredLabel required>내용</RequiredLabel>
            <TextField
              id="post-content"
              value={content}
              onChange={setContent}
              placeholder="기록하고 싶은 활동과 순간을 남겨보세요."
              maxLength={5000}
              showCount
              multiline
              rows={12}
              error={contentError}
            />

            {/* 본문 에러 문구 */}
            <div aria-live="polite">
              {contentError ? (
                <p className="typo-caption mt-3 text-[#FF0000]">
                  {contentError}
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <BtnBasic variant="gray" onClick={() => navigate(-1)}>
              취소
            </BtnBasic>
            <BtnBasic
              variant={isFormValid && !isPending ? "blue" : "gray"}
              onClick={handleSubmit}
              disabled={!isFormValid || isPending}
            >
              {isPending ? "등록 중..." : "등록"}
            </BtnBasic>
          </div>
        </div>
      </div>
    </div>
  );
}
