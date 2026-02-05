import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import tabActiveImg from "../../assets/images/tab-active.png";
import tabInactiveImg from "../../assets/images/tab-inactive.png";

export type TabItem = {
  id: string;
  title: string;
};

type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onRename?: (id: string, nextTitle: string) => void;
  maxTabs?: number;
  addButtonLabel?: string;
  className?: string;
  tabWidth?: number;
  tabHeight?: number;
  overlapOffset?: number;
  showRemoveButtons?: boolean; // 부모가 편집모드일 때 true로 넘길 것
};

export default function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  onAdd,
  onRemove,
  onRename,
  maxTabs = 10,
  addButtonLabel = "+ 탭 추가",
  className,
  tabWidth = 130,
  tabHeight = 70,
  overlapOffset = 8,
  showRemoveButtons = false,
}: TabsProps) {
  const isControlled = value !== undefined;
  const [internalActive, setInternalActive] = useState<string | undefined>(
    defaultValue ?? items[0]?.id
  );
  const activeId = isControlled ? value : internalActive;

  useEffect(() => {
    if (!activeId && items.length > 0) {
      const first = items[0].id;
      if (!isControlled) setInternalActive(first);
      onChange?.(first);
    }
  }, [items]);

  const handleChange = (id: string) => {
    if (!isControlled) setInternalActive(id);
    onChange?.(id);
  };

  // 인라인 편집 상태 관리
  const [editingMap, setEditingMap] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    Object.keys(editingMap).forEach((id) => {
      if (editingMap[id]) {
        setTimeout(() => {
          inputRefs.current[id]?.focus();
          inputRefs.current[id]?.select();
        }, 0);
      }
    });
  }, [editingMap]);

  const canAdd = items.length < maxTabs;

  return (
    <div
      className={twMerge("relative w-full overflow-visible", className)}
      style={{ height: tabHeight }}
    >
      <div className="relative h-full" role="tablist" aria-label="tabs">
        {items.map((it, idx) => {
          const isActive = activeId === it.id;

          const zIndex = 1000 + idx;
          const left = idx * (tabWidth - overlapOffset);

          const bg = isActive ? tabActiveImg : tabInactiveImg;

          return (
            <div
              key={it.id}
              style={{
                position: "absolute",
                left,
                width: tabWidth,
                height: tabHeight,
                zIndex,
                pointerEvents: "auto",
              }}
            >
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => handleChange(it.id)}
                onDoubleClick={() =>
                  setEditingMap((p) => ({ ...p, [it.id]: true }))
                }
                className="w-full h-full pl-2.5 pr-6 overflow-visible"
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  WebkitBackgroundClip: "padding-box",
                  backgroundClip: "padding-box",
                  boxShadow: "-5px 0px 7px -2px rgba(0, 0, 0, 0.187)",
                }}
              >
                {/* 타이틀 또는 인라인 입력 */}
                {editingMap[it.id] ? (
                  <input
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[it.id] = el;
                    }}
                    defaultValue={it.title}
                    maxLength={7}
                    onBlur={(e) => {
                      const next = e.target.value.trim().slice(0, 7);
                      setEditingMap((p) => ({ ...p, [it.id]: false }));
                      if (next !== it.title) onRename?.(it.id, next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        (e.target as HTMLInputElement).blur();
                      if (e.key === "Escape")
                        setEditingMap((p) => ({ ...p, [it.id]: false }));
                    }}
                    className="px-1 py-2 w-23.5 y-10 border rounded text-color-highest border-border-high focus:outline-none"
                  />
                ) : (
                  <span
                    className={`truncate typo-body2-semibold ${
                      isActive ? "text-color-highest" : "text-color-high"
                    }`}
                  >
                    {it.title || "무제 탭"}
                  </span>
                )}
              </button>
            </div>
          );
        })}

        {/* 삭제 버튼 */}
        {showRemoveButtons &&
          items.map((it, idx) => {
            const left = idx * (tabWidth - overlapOffset);
            return (
              <div
                key={`del-${it.id}`}
                style={{
                  position: "absolute",
                  left: left + tabWidth - 48,
                  top: -10,
                  zIndex: 200000,
                  pointerEvents: "auto",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(it.id);
                  }}
                  className="size-7.5 rounded-full bg-low flex items-center justify-center text-white hover:bg-high cursor-pointer"
                >
                  ✕
                </button>
              </div>
            );
          })}

        {/* +탭 */}
        {canAdd && (
          <div
            style={{
              position: "absolute",
              left: items.length * (tabWidth - overlapOffset),
              width: tabWidth,
              height: tabHeight,
              zIndex: 1000 + items.length,
              pointerEvents: "auto",
            }}
          >
            <button
              type="button"
              onClick={onAdd}
              className="w-full h-full py-[25.5px] pl-2.5 pr-6"
              style={{
                backgroundImage: `url(${tabInactiveImg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                WebkitBackgroundClip: "padding-box",
                backgroundClip: "padding-box",
                boxShadow: "-5px 0px 7px -2px rgba(0, 0, 0, 0.187)",
              }}
            >
              <div className="typo-body2-semibold text-high">
                {addButtonLabel}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
