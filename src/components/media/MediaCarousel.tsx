import { useEffect, useState } from "react";
import ImgCard from "../common/Card/ImgCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { MediaItem } from "@/types/media";

export default function MediaCarousel({
  items,
  onRemove,
  onCardClick,
  cardWidth = 360,
  gap = 24,
  windowWidth = 1240,
  slideBy = 1,
  selectedId,
  readOnly = false,
  // showRepresentativeBadge = false,
  // nextOffset,
  prevOffset,
}: {
  items: MediaItem[];
  onRemove?: (id: string) => void;
  onCardClick?: (id: string) => void;
  cardWidth?: number;
  gap?: number;
  windowWidth?: number;
  slideBy?: number;
  selectedId?: string | null;
  readOnly?: boolean;
  showRepresentativeBadge?: boolean;
  prevOffset?: number; // px
  nextOffset?: number; // px
}) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = Math.max(1, Math.floor(windowWidth / (cardWidth + gap)));
  const totalTrackWidth = items.length * (cardWidth + gap) - gap;
  const maxStart = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    if (startIndex > maxStart) setStartIndex(maxStart);
  }, [items.length, maxStart, startIndex]);

  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;
  const showButtons = totalTrackWidth > windowWidth;

  const handleNext = () =>
    setStartIndex((s) => Math.min(maxStart, s + slideBy));
  const handlePrev = () => setStartIndex((s) => Math.max(0, s - slideBy));
  const translateX = -(startIndex * (cardWidth + gap));

  return (
    <div
      style={{
        position: "relative",
        width: `${windowWidth}px`,
        overflow: "visible",
      }}
    >
      {/* Prev (wrapper 밖, 절대 위치) */}
      {showButtons && (
        <button
          aria-label="이전"
          onClick={handlePrev}
          disabled={!canPrev}
          style={{
            position: "absolute",
            left: typeof prevOffset === "number" ? prevOffset : 20,

            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            width: 54,
            height: 54,
            borderRadius: 9999,
            background: "#A6BBCE",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            opacity: canPrev ? 1 : 0.4,
            pointerEvents: canPrev ? "auto" : "none",
          }}
          className="flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-10 h-7 text-color-lowest" />
        </button>
      )}

      {/* viewport (overflow hidden) */}
      <div style={{ width: `${windowWidth}px`, overflow: "hidden" }}>
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(${translateX}px)`,
            gap: `${gap}px`,
            width: `${items.length * (cardWidth + gap) - gap}px`,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              style={{ width: `${cardWidth}px`, minWidth: `${cardWidth}px` }}
            >
              <ImgCard
                onClick={() => {
                  if (!readOnly) onCardClick?.(it.id); // 읽기전용이면 클릭 무시
                }}
                img={it.url}
                mediaType={it.mediaType}
                type={it.isRepresentative ? "representative" : "normal"}
                selected={selectedId === it.id}
                onDelete={!readOnly ? () => onRemove?.(it.id) : undefined}
                readOnly={readOnly}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next (wrapper 밖) */}
      {showButtons && (
        <button
          aria-label="다음"
          onClick={handleNext}
          disabled={!canNext}
          style={{
            position: "absolute",
            right: -70,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            width: 54,
            height: 54,
            borderRadius: 9999,
            background: "#A6BBCE",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            opacity: canNext ? 1 : 0.4,
            pointerEvents: canNext ? "auto" : "none",
          }}
          className="flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-10 h-7 text-color-lowest" />
        </button>
      )}
    </div>
  );
}
