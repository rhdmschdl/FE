import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import List from "./List";
import { ChevronDown, ChevronUp } from "lucide-react";

export type SelectBoxOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectBoxProps<T extends string = string> = {
  options: readonly SelectBoxOption<T>[] | SelectBoxOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  className?: string;
  placeholder?: string;
  Icon?: React.ReactNode;
};

export default function SelectBox<T extends string = string>({
  options,
  value,
  onChange,
  className,
  placeholder = "전체",
  Icon,
}: SelectBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isOpen]);

  // 선택된 옵션 찾기
  const selectedOption = options.find((opt) => opt.value === value);
  // 선택된 옵션이 없으면 placeholder 표시
  const displayText = selectedOption?.label || placeholder;
  // 기본 스타일
  const base =
    "w-[110px] h-[44px] px-[5px] py-[10px] rounded-[8px] cursor-pointer flex items-center justify-between gap-2";
  // 활성화 스타일
  const enabled = "bg-brand-blue-100 text-color-highest";
  const hover = "hover:bg-brand-blue-200 hover:text-color-highest";

  return (
    <div ref={containerRef} className={twMerge("relative", className)}>
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={twMerge(
          base,
          enabled,
          hover,
          isOpen && "border-color-primary border-[2px] border-solid"
        )}
      >
        <span className="typo-body2-medium flex-1 text-center">
          {displayText}
        </span>
        {Icon ||
          (isOpen ? (
            <ChevronUp className="w-[24px] h-[24px] shrink-0 text-color-primary" />
          ) : (
            <ChevronDown className="w-[24px] h-[24px] shrink-0 text-color-high" />
          ))}
      </button>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div className="py-2.5 absolute top-full left-0 right-0 mt-[8px] bg-brand-blue-100 rounded-[8px] shadow-[0px_0px_4px_0px_var(--color-border-mid)] flex flex-col overflow-hidden z-10">
          {options.map((opt) => (
            <List
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              selected={opt.value === value}
              className="w-full"
            >
              {opt.label}
            </List>
          ))}
        </div>
      )}
    </div>
  );
}
