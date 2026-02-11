import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type ImageModalProps = {
  open: boolean;
  imageUrl: string;
  fileName?: string;
  alt?: string;
  onClose: () => void;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export default function ImageModal({
  open,
  imageUrl,
  alt = "image",
  onClose,
}: ImageModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [toolbarOpacity, setToolbarOpacity] = useState(0);
  const [scaleInput, setScaleInput] = useState("");
  const dragStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 애니메이션
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setToolbarOpacity(0);
    }
  }, [open]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 모달 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 화면 하단 중앙 영역 감지 + 툴바 opacity 점진적 조절
  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;

      // x축: 중앙 기준 150px 이내면 100%, 150~300px 구간에서 점진적 감소
      const xDistance = Math.abs(e.clientX - centerX);
      const xFadeStart = 150;
      const xFadeEnd = 300;
      let xProgress = 0;
      if (xDistance < xFadeStart) {
        xProgress = 1;
      } else if (xDistance < xFadeEnd) {
        xProgress = 1 - (xDistance - xFadeStart) / (xFadeEnd - xFadeStart);
      }

      // y축: 하단 100px 이내면 100%, 100~200px 구간에서 점진적 증가
      const yDistance = windowHeight - e.clientY;
      const yFadeStart = 100;
      const yFadeEnd = 200;
      let yProgress = 0;
      if (yDistance < yFadeStart) {
        yProgress = 1;
      } else if (yDistance < yFadeEnd) {
        yProgress = 1 - (yDistance - yFadeStart) / (yFadeEnd - yFadeStart);
      }

      // x, y 둘 다 고려해서 opacity 결정
      setToolbarOpacity(xProgress * yProgress);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [open]);

  // 확대
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  }, []);

  // 축소
  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.max(prev - SCALE_STEP, MIN_SCALE);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  // 초기화
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 퍼센트 입력 처리
  const handleScaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleInput(e.target.value);
  };

  const handleScaleInputBlur = () => {
    const value = parseInt(scaleInput, 10);
    if (!isNaN(value)) {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value / 100));
      setScale(newScale);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
    setScaleInput("");
  };

  const handleScaleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setScaleInput("");
      e.currentTarget.blur();
    }
  };

  // 다운로드 (새 탭에서 열기)
  const handleDownload = useCallback(() => {
    window.open(imageUrl, "_blank");
  }, [imageUrl]);

  // 드래그 시작
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      positionStart.current = { ...position };
    },
    [scale, position]
  );

  // 드래그 중
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: positionStart.current.x + dx,
        y: positionStart.current.y + dy,
      });
    },
    [isDragging]
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 휠로 확대/축소 (non-passive event listener)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !open) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
      } else {
        setScale((prev) => {
          const newScale = Math.max(prev - SCALE_STEP, MIN_SCALE);
          if (newScale <= 1) {
            setPosition({ x: 0, y: 0 });
          }
          return newScale;
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="이미지 보기"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden
      />

      {/* 이미지 컨테이너 */}
      <div
        ref={containerRef}
        className="relative z-10 flex items-center justify-center"
      >
        <div
          className={`transition-transform duration-200 ${
            isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : ""
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
        >
          <img
            src={imageUrl}
            alt={alt}
            className={`max-w-[90vw] max-h-[90vh] object-contain select-none transition-transform duration-200 ${
              isVisible ? "scale-100" : "scale-95"
            }`}
            draggable={false}
          />
        </div>
      </div>

      {/* 하단 툴바 (화면 하단 고정) */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm"
        style={{
          opacity: toolbarOpacity,
          pointerEvents: toolbarOpacity > 0.3 ? "auto" : "none",
        }}
        onMouseEnter={() => setToolbarOpacity(1)}
      >
        <button
          type="button"
          onClick={handleDownload}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="다운로드"
          title="다운로드"
        >
          <Download className="w-5 h-5 text-white" />
        </button>
        <div className="w-px h-5 bg-white/30 mx-1" />
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="축소"
          title="축소"
          disabled={scale <= MIN_SCALE}
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <div className="relative min-w-[48px] flex items-center justify-center">
          <input
            type="text"
            value={scaleInput || `${Math.round(scale * 100)}%`}
            onChange={handleScaleInputChange}
            onFocus={(e) => {
              setScaleInput(String(Math.round(scale * 100)));
              e.target.select();
            }}
            onBlur={handleScaleInputBlur}
            onKeyDown={handleScaleInputKeyDown}
            className="w-[48px] bg-transparent text-white text-sm text-center font-medium outline-none border-b border-transparent focus:border-white/50"
            aria-label="확대 비율"
          />
        </div>
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="확대"
          title="확대"
          disabled={scale >= MAX_SCALE}
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="원래 크기로"
          title="원래 크기로"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <div className="w-px h-5 bg-white/30 mx-1" />
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="닫기"
          title="닫기"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
