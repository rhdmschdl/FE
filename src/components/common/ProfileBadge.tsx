import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import UserIcon from "@/assets/icon/S.svg";
import { PencilIcon } from "lucide-react";

type Props = {
  avatarUrl?: string | null; // 서버에서 받은 URL(없으면 기본아이콘)
  displayName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  nameClassName?: string;
  onClick?: () => void;
  "aria-label"?: string;
  editable?: boolean;
  onRename?: (next: string) => Promise<void> | void;
  nameMaxLength?: number;
};

export default function ProfileBadge({
  avatarUrl,
  displayName,
  size = "md",
  className,
  nameClassName,
  onClick,
  "aria-label": ariaLabel,
  editable = false,
  onRename,
  nameMaxLength = 10,
}: Props) {
  const sizeMap = {
    sm: "w-6 h-6 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-30 h-30 text-4xl",
  } as const;

  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(displayName ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocalName(displayName ?? "");
  }, [displayName]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  const startEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!editable) return;
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setLocalName(displayName ?? "");
    setIsEditing(false);
  };

  const commitEdit = async () => {
    const next = (localName ?? "").trim().slice(0, nameMaxLength);
    if (!next) {
      // 빈값이면 취소 처리
      cancelEdit();
      return;
    }
    if (next === (displayName ?? "")) {
      setIsEditing(false);
      return;
    }
    // 닉네임 유효성 검사: 2~10자, 한글/영어/숫자/-/_ 만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9-_]{2,10}$/;
    if (!nicknameRegex.test(next)) {
      alert("2~10자 이내 한글, 영어, 숫자, -, _ 중에 작성해 주세요.");
      cancelEdit();
      return;
    }
    try {
      await onRename?.(next);
      // 만약 부모가 displayName을 업데이트해주지 않으면 로컬에 반영
      setLocalName(next);
    } catch (err) {
      console.error("닉네임 저장 실패", err);
      // 실패 시 유저에게 알림을 띄우거나 롤백 처리 가능
      alert("닉네임 저장 중 오류가 발생했습니다.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      commitEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div
      role={onClick ? "button" : "group"}
      onClick={onClick}
      aria-label={ariaLabel ?? `${displayName ?? "사용자명"} 프로필`}
      className={clsx("flex items-center gap-2.5", className)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick && (e.key === "Enter" || e.key === " ")) {
          if (editable) startEdit();
        }
      }}
    >
      <div
        className={clsx(
          "rounded-full overflow-hidden bg-surface-container-10 flex-shrink-0",
          sizeMap[size]
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName ?? "사용자명"}의 프로필 사진`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <img
            src={UserIcon}
            alt="기본 프로필"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="relative flex items-center">
        {!isEditing ? (
          <div className="flex items-center gap-2">
            {/* editable일 때만 연필 아이콘 보이기 (버튼으로 접근성 제공) */}
            {editable && (
              <button
                type="button"
                onClick={startEdit}
                aria-label="닉네임 편집"
                className="p-1 rounded focus:outline-none focus:ring"
              >
                <PencilIcon className="size-8 text-color-high" />
              </button>
            )}
            <p className={clsx("text-color-highest", nameClassName)}>
              {displayName ?? "사용자명"}
            </p>
          </div>
        ) : (
          <input
            ref={inputRef}
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={() => commitEdit()}
            onKeyDown={handleKeyDown}
            aria-label="닉네임 입력"
            maxLength={nameMaxLength}
            className="typo-h1 text-color-high focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
