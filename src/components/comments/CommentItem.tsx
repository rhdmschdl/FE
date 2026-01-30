import { useState } from "react";
import CommentInput from "./CommentInput";
import ProfileBadge from "../common/ProfileBadge";
import { BtnIcon } from "../common/Button/Btn";
import { ChevronDown, ChevronUp } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import TrashIcon from "@/assets/icon/TrashIcon";
import ExclamationIcon from "@/assets/icon/ExclamationIcon";
import { CornerDownRight } from "lucide-react";
import type { User } from "@/types/user";

export type CommentModel = {
  id: string;
  authorId: string | number;
  authorName: string;
  text: string;
  createdAt: string;
  replies?: CommentModel[];
  serverId?: string | number;
  isOwner?: boolean;
};

type Props = {
  comment: CommentModel;
  currentUserId: string | null;
  currentUser?: User | null;
  onAddReply: (parentId: string, text: string) => void;
  onDeleteImmediate: (id: string, isReply: boolean, parentId?: string) => void;
};

export default function CommentItem({
  comment,
  currentUserId,
  currentUser,
  onAddReply,
  onDeleteImmediate,
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const isAuthor =
    typeof comment.isOwner === "boolean"
      ? comment.isOwner
      : currentUserId != null &&
        String(comment.authorId) === String(currentUserId);

  const isReplyAuthor = (r: CommentModel) => {
    return typeof r.isOwner === "boolean"
      ? r.isOwner
      : currentUserId != null && String(r.authorId) === String(currentUserId);
  };

  return (
    <div className="">
      <div className="flex gap-5 p-5 bg-surface-container-10">
        <div className="flex flex-col gap-2.5 flex-1">
          <ProfileBadge
            avatarUrl={undefined}
            displayName={comment.authorName ?? "사용자명"}
            size="sm"
            className="flex-shrink-0"
            nameClassName="typo-body2-semibold "
          />

          <div className="ml-8.5">
            <div className="typo-body2-medium text-highest">{comment.text}</div>
            <div className="typo-caption mt-2.5 text-mid">
              {comment.createdAt}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 items-end">
          {isAuthor ? (
            <ConfirmModal
              trigger={
                <button aria-label="댓글 삭제" className="cursor-pointer">
                  <TrashIcon size={20} />
                </button>
              }
              icon={<ExclamationIcon size={60} />}
              title="해당 댓글을 삭제하시겠어요?"
              confirmLabel="확인"
              cancelLabel="취소"
              onConfirm={() => onDeleteImmediate(comment.id, false)}
            />
          ) : (
            <div aria-hidden="true" className="w-5 h-[27.33px]"></div>
          )}
          <BtnIcon
            // selected={isSelected}
            onClick={() => setReplyOpen((s) => !s)}
            endIcon={
              replyOpen ? (
                <ChevronUp size={20} color="#7D9AB2" />
              ) : (
                <ChevronDown size={20} color="#7D9AB2" />
              )
            }
            className="bg-surface-bg hover:bg-surface-container-20 active:bg-surface-bg"
          >
            <span className="w-19">답글</span>
          </BtnIcon>
        </div>
      </div>

      {/* 답글 리스트 */}
      {replyOpen && comment.replies && comment.replies.length > 0 && (
        <div className="bg-surface-container-20 border-t border-mid divide-y divide-border-mid">
          {comment.replies.map((r) => {
            const replyIsAuthor = isReplyAuthor(r);
            return (
              <div key={r.id}>
                <div className="flex p-5">
                  <CornerDownRight
                    size={20}
                    color="#CBD5DF"
                    className="mr-2.5"
                  />
                  <div className="flex flex-col gap-2.5 flex-1">
                    <ProfileBadge
                      avatarUrl={undefined}
                      displayName={r.authorName ?? "사용자명"}
                      size="sm"
                      className="flex-shrink-0"
                      nameClassName="typo-body2-semibold "
                    />
                    <div className="ml-8.5">
                      <div className="typo-body2-medium text-highest">
                        {r.text}
                      </div>
                      <div className="typo-caption mt-2.5 text-mid">
                        {r.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col ml-5 gap-2 items-end">
                    {replyIsAuthor && (
                      <ConfirmModal
                        trigger={
                          <button
                            aria-label="답글 삭제"
                            className="cursor-pointer"
                          >
                            <TrashIcon size={20} />
                          </button>
                        }
                        icon={<ExclamationIcon size={60} />}
                        title="해당 답글을 삭제하시겠어요?"
                        confirmLabel="확인"
                        cancelLabel="취소"
                        onConfirm={() =>
                          onDeleteImmediate(r.id, true, comment.id)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 답글 입력 폼 (토글) */}
      {replyOpen && (
        <div className="bg-surface-container-20 border-t border-border-mid">
          <div className="flex p-5">
            <CornerDownRight size={20} color="#CBD5DF" className="mr-2.5" />
            <div className="flex flex-col gap-2.5 w-full">
              <ProfileBadge
                size="sm"
                className="flex-shrink-0"
                avatarUrl={undefined}
                displayName={currentUser?.nickname ?? "사용자명"}
                nameClassName="typo-body2-semibold "
              />
              <div className="flex-1">
                <CommentInput
                  value={replyText}
                  onChange={setReplyText}
                  onSubmit={() => {
                    if (replyText.trim() === "") return;
                    onAddReply(comment.id, replyText.trim());
                    setReplyText("");
                  }}
                  placeholder="답글을 작성해주세요."
                  maxLength={3000}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
