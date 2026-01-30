import { useMemo, useState, useEffect, useCallback } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import type { CommentModel } from "./CommentItem";
import ButtonLike from "../archive/ButtonLike";
import ProfileBadge from "../common/ProfileBadge";
import type { User } from "@/types/user";
import togglePostLike from "@/apis/mutations/community/toggleLike";
import fetchPostComments from "@/apis/queries/community/getComments";
import type { ServerCommentDto } from "@/apis/queries/community/getComments";
import createCommentApi from "@/apis/mutations/community/createComments";
import deleteCommentApi from "@/apis/mutations/community/deleteComment";

type CommentModelLocal = {
  id: string;
  authorId: string | number;
  authorName: string;
  text: string;
  createdAt: string;
  replies?: CommentModelLocal[];
  deleted?: boolean;
  serverId?: number;
  isOwner?: boolean;
};

type Props = {
  postId?: string | number;
  initialComments?: CommentModel[];
  currentUserId?: string | null;
  currentUser?: User | null;
  onSubmitComment?: (text: string) => Promise<CommentModel | null>;
  onDeleteCommentApi?: (id: string) => Promise<boolean>;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
};

export default function CommentSection({
  postId,
  initialComments = [],
  currentUserId = null,
  currentUser,
  initialLikeCount = 0,
  initialIsLiked = false,
}: Props) {
  const [comments, setComments] = useState<CommentModel[]>(initialComments);
  const [open, setOpen] = useState(true); // 댓글 섹션 기본 열림
  const [input, setInput] = useState("");

  // 댓글 페이징 / 로딩 상태
  const [, setSubmittingComment] = useState(false);
  const [, setSubmittingReplyFor] = useState<string | null>(null);
  const [, setDeletingCommentId] = useState<string | number | null>(null);
  const [, setLoadingComments] = useState<boolean>(false);
  const [, setCommentsPage] = useState<number>(0);

  // 좋아요 관련 상태
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [pendingLike, setPendingLike] = useState<boolean>(false);

  // 좋아요 토글 핸들러 (낙관적 업데이트 + 실패 롤백)
  const handleToggleLike = async () => {
    if (!postId) {
      console.warn("postId가 없어 좋아요를 요청할 수 없습니다.");
      return;
    }
    if (pendingLike) return;
    setPendingLike(true);

    const prevLiked = isLiked;
    const prevCount = likeCount;

    // 낙관적 업데이트
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await togglePostLike(postId);
      if (res?.likeCount !== undefined) setLikeCount(res.likeCount);
      if (typeof res?.liked === "boolean") setIsLiked(res.liked);
      if (typeof res?.isLiked === "boolean") setIsLiked(res.isLiked);
    } catch (err: any) {
      // 롤백
      setIsLiked(prevLiked);
      setLikeCount(prevCount);

      console.error("좋아요 요청 실패:", err);
      if (err?.response?.status === 401) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      } else {
        alert(
          "좋아요 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    } finally {
      setPendingLike(false);
    }
  };

  // 서버 DTO -> CommentModelLocal 재귀 변환
  const mapServerCommentToModel = (s: ServerCommentDto): CommentModelLocal => {
    const id = String(
      (s as any).commentId ??
        (s as any).id ??
        `c-${Math.random().toString(36).slice(2, 9)}`
    );
    const authorId = String((s as any).userId ?? (s as any).authorId ?? "");
    const authorName = (s as any).nickname ?? (s as any).authorName ?? "익명";
    const text = (s as any).content ?? (s as any).text ?? "";
    const rawCreatedAt = (s as any).createdAt ?? new Date().toISOString();
    const createdAt = formatDateYMD(rawCreatedAt);
    const childrenRaw = (s as any).children ?? [];
    let replies: CommentModelLocal[] | undefined = undefined;

    if (Array.isArray(childrenRaw)) {
      replies = childrenRaw.map((r: any) => ({
        id: String(
          r.commentId ?? r.id ?? `c-${Math.random().toString(36).slice(2, 9)}`
        ),
        authorId: String(r.userId ?? r.authorId ?? ""),
        authorName: r.nickname ?? r.authorName ?? "익명",
        text: r.content ?? r.text ?? "",
        createdAt: formatDateYMD(r.createdAt ?? new Date().toISOString()),
        isOwner: typeof r.isOwner === "boolean" ? r.isOwner : undefined,
        replies: Array.isArray(r.children)
          ? r.children.map((rr: any) => ({
              id: String(
                rr.commentId ??
                  rr.id ??
                  `c-${Math.random().toString(36).slice(2, 9)}`
              ),
              authorId: String(rr.userId ?? rr.authorId ?? ""),
              authorName: rr.nickname ?? rr.authorName ?? "익명",
              text: rr.content ?? rr.text ?? "",
              createdAt: formatDateYMD(
                rr.createdAt ?? new Date().toISOString()
              ),
            }))
          : undefined,
      }));
    } else if (typeof childrenRaw === "string") {
      try {
        const parsed = JSON.parse(childrenRaw);
        if (Array.isArray(parsed)) {
          replies = parsed.map((r: any) => ({
            id: String(
              r.commentId ??
                r.id ??
                `c-${Math.random().toString(36).slice(2, 9)}`
            ),
            authorId: String(r.userId ?? r.authorId ?? ""),
            authorName: r.nickname ?? r.authorName ?? "익명",
            text: r.content ?? r.text ?? "",
            createdAt: formatDateYMD(r.createdAt ?? new Date().toISOString()),
            isOwner: typeof r.isOwner === "boolean" ? r.isOwner : undefined,
          }));
        }
      } catch {
        replies = undefined;
      }
    }

    return {
      id,
      authorId,
      authorName,
      text,
      createdAt,
      replies,
      deleted: !!(s as any).deleted,
      serverId: Number(s.commentId),
      isOwner:
        typeof (s as any).isOwner === "boolean"
          ? (s as any).isOwner
          : undefined,
    };
  };

  // 댓글 로드 함수 (page 기반)
  const loadComments = useCallback(
    async (
      opts: {
        page?: number;
        size?: number;
        lastCommentId?: string | number;
      } = {}
    ) => {
      if (!postId) return;
      setLoadingComments(true);

      try {
        const page = opts.page ?? 0;
        const size = opts.size ?? 20;
        const res = await fetchPostComments(postId, {
          page,
          size,
          lastCommentId: opts.lastCommentId,
        });
        const mapped = (res.content ?? []).map(mapServerCommentToModel);

        if (page === 0) {
          setComments(mapped);
        } else {
          setComments((prev) => [...prev, ...mapped]);
        }

        setCommentsPage(page);
      } catch (err: any) {
        console.error("댓글 로드 실패:", err);
      } finally {
        setLoadingComments(false);
      }
    },
    [postId]
  );

  // postId 변경 시 초기 로드
  useEffect(() => {
    setComments(initialComments);
    setCommentsPage(0);

    if (postId) {
      loadComments({ page: 0, size: 20 });
    }
  }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 댓글 개수 (원댓글 + 답글 모두 합산)
  const commentCount = useMemo(() => {
    let c = 0;
    comments.forEach((cm) => {
      c += 1;
      if (cm.replies) c += cm.replies.length;
    });
    return c;
  }, [comments]);

  function formatDateYMD(input: Date | string | number): string {
    if (!input && input !== 0) return "";

    // 1) Date 인스턴스면 그대로 사용
    let d: Date;
    if (input instanceof Date) {
      d = input;
    } else {
      // 2) 문자열/숫자일 경우 안전하게 파싱
      const s = String(input);

      // 일부 환경에서 마이크로초(6자리) 때문에 Date 파싱 실패 가능 -> 3자리(밀리초)로 줄여봄
      // ex: "2026-01-29T20:31:28.240313+09:00" -> "2026-01-29T20:31:28.240+09:00"
      const cleaned = s.replace(/(\.\d{3})\d+([+-]\d{2}:\d{2})?$/, "$1$2");

      d = new Date(cleaned);
      if (Number.isNaN(d.getTime())) {
        // 마지막 시도: 타임존 정보 제거 후 파싱(로컬 시간으로 해석)
        const noTz = cleaned.replace(/([+-]\d{2}:\d{2}|Z)$/, "");
        d = new Date(noTz);
      }
    }

    if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${y}.${m}.${dd}`;
  }

  const handleSubmitComment = async () => {
    if (!input.trim() || !postId) return;
    const content = input.trim();
    setSubmittingComment(true);

    try {
      // parentId null => 원댓글
      await createCommentApi({ postId, content, parentId: null });
      await loadComments({ page: 0, size: 20 });
      setInput("");
    } catch (err: any) {
      console.error("원댓글 등록 실패:", err);
      alert(
        err?.response?.data?.message ?? "댓글 등록 중 오류가 발생했습니다."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  // 답글 등록
  const handleAddReply = async (parentLocalId: string, text: string) => {
    if (!text.trim() || !postId) return;
    const trimmed = text.trim();

    // 부모 serverId 확보
    const parent = comments.find((c) => c.id === parentLocalId);
    const parentServerIdRaw = parent?.serverId ?? parentLocalId;
    const maybeNum = Number(parentServerIdRaw);
    if (Number.isNaN(maybeNum)) {
      alert("부모 댓글 ID가 유효하지 않습니다.");
      return;
    }
    const parentIdForApi = maybeNum;

    setSubmittingReplyFor(String(parentIdForApi));
    try {
      await createCommentApi({
        postId,
        content: trimmed,
        parentId: parentIdForApi,
      });
      // 성공 시 전체 목록 재로딩
      await loadComments({ page: 0, size: 20 });
    } catch (err: any) {
      console.error("답글 등록 실패:", err);
      alert(
        err?.response?.data?.message ?? "답글 등록 중 오류가 발생했습니다."
      );
    } finally {
      setSubmittingReplyFor(null);
    }
  };

  // 삭제
  const deleteImmediate = async (
    id: string,
    isReply: boolean,
    parentId?: string
  ) => {
    const target = comments.find((c) => c.id === id);
    const serverId =
      target?.serverId ??
      (Number(id) && !Number.isNaN(Number(id)) ? Number(id) : undefined);
    if (!serverId) {
      if (isReply && parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== id) }
              : c
          )
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
      return;
    }

    setDeletingCommentId(serverId);
    try {
      await deleteCommentApi(serverId);
      // 성공하면 전체 재로딩으로 일관성 보장
      await loadComments({ page: 0, size: 20 });
    } catch (err: any) {
      console.error("댓글 삭제 실패:", err);
      alert(err?.response?.data?.message ?? "댓글 삭제에 실패했습니다.");
      // 실패 시 목록 재동기화로 상태 복원
      await loadComments({ page: 0, size: 20 });
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between w-310 mb-5">
        <div>
          <ButtonLike
            onClick={handleToggleLike}
            liked={isLiked}
            likeCount={likeCount}
            // disabled={pendingLike}
          />
        </div>

        <div>
          <button
            className="w-45 h-11 flex gap-2.5 p-2.5 justify-center items-center typo-body2-medium text-color-highest bg-surface-container-10 rounded-lg"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
          >
            <MessageCircle size={17} color="#7D9AB2" />
            <span>댓글</span>
            <span className="text-surface-container-30 font-medium">
              |
            </span>{" "}
            <span className="w-11">{commentCount}</span>
            <ChevronDown
              size={20}
              className={open ? "hidden" : "block"}
              color="#7D9AB2"
            />
            <ChevronUp
              size={20}
              className={open ? "block" : "hidden"}
              color="#7D9AB2"
            />
          </button>
        </div>
      </div>

      {open && (
        <div>
          <div aria-live="polite">
            {comments.length === 0 ? (
              <div className="mb-5 typo-h3 text-[#B6C6D5] bg-surface-container-10 w-full flex justify-center items-center h-26">
                아직 작성된 댓글이 없어요.
              </div>
            ) : (
              comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentUserId={currentUserId}
                  currentUser={currentUser}
                  onAddReply={handleAddReply}
                  onDeleteImmediate={deleteImmediate}
                />
              ))
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2.5 bg-brand-blue-100 rounded-lg p-5 mb-20">
            <ProfileBadge
              avatarUrl={undefined}
              displayName={currentUser?.nickname ?? "사용자명"}
              size="sm"
              className="flex-shrink-0"
              nameClassName="typo-body2-semibold "
            />
            <CommentInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmitComment}
              placeholder="댓글을 입력해주세요."
              maxLength={3000}
            />
          </div>
        </div>
      )}
    </div>
  );
}
