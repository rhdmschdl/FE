import { X } from "lucide-react";
import { useEffect, useState } from "react";

type CalendarTagProps = {
  tags?: string[];
  onTagChange?: (data: { tags: string[] }) => void;
};

const CalendarTag = ({ tags, onTagChange }: CalendarTagProps) => {
  const [tag, setTag] = useState("");
  const [tagsState, setTagsState] = useState<string[]>(tags || []);
  const [error, setError] = useState<string | null>(null); // ✅ 에러 state 추가

  // 🔁 edit 모드에서 props로 들어온 태그와 동기화
  useEffect(() => {
    setTagsState(tags || []);
  }, [tags]);

  const handleAddTag = () => {
    const trimmedTag = tag.trim();
    if (trimmedTag === "") return;

    if (tagsState.includes(trimmedTag)) {
      setError("이미 등록된 태그입니다.");
      return;
    }

    const next = [...tagsState, trimmedTag];
    setTagsState(next);
    onTagChange?.({ tags: next });      // ✅ 부모로 변경사항 전달
    setTag("");
    setError(null);
  };

  const handleDeleteTag = (target: string) => {
    const next = tagsState.filter((t) => t !== target);
    setTagsState(next);
    onTagChange?.({ tags: next });      // ✅ 부모로 변경사항 전달
  };

  return (
    <div className="w-165 flex flex-col itmes-center gap-5">
      <div className="w-full flex flex-col items-end gap-1">
        <div className="w-full flex items-center justify-between">
          <p className="py-1.5 typo-h2-semibold text-color-highest">
            태그 설정
          </p>
          <input
            className={`w-[551px] h-10 border-2 rounded-lg 
              bg-surface-bg px-4 typo-body1 text-color-highest focus:outline-none placeholder:text-color-mid
              ${error
                ? "border-2 border-[#FF0000]"
                : "border-2 border-border-mid"
              }`} // ✅ 에러 시 빨간 테두리
            placeholder="태그명 입력"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setError(null); // ✅ 입력 시 에러 초기화
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.nativeEvent.isComposing) return;
                e.preventDefault();
                e.stopPropagation();
                handleAddTag();
              }
            }}
          />
        </div>
        {/* ✅ 에러 메시지 표시 */}
        {error && <p className="typo-body2 text-[#FF0000]">{error}</p>}
      </div>
      <div className="w-165 flex flex-wrap items-center gap-2">
        {tagsState.map((tag) => (
          <div
            key={tag}
            className=" h-11 flex px-5 py-2.5 justify-center items-center gap-2.5 rounded-4xl bg-brand-blue-100"
          >
            <p className="typo-body2 text-color-high">{tag}</p>
            <X
              className="w-6 h-6 text-color-high cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTag(tag);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarTag;
