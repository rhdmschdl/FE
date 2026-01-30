import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  maxRetries?: number;
  retryIntervalMs?: number;
};

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  maxRetries = 0,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  // 이미지 로드 성공
  const onLoad = () => {
    setLoaded(true);
    setFailed(false);
  };

  // 이미지 로드 실패 처리
  const onError = () => {
    if (attempt < maxRetries) {
      setAttempt((a) => a + 1);
      // 타임스탬프 붙여 재요청
      const t = Date.now();
      setCurrentSrc(`${src}${src.includes("?") ? "&" : "?"}t=${t}`);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`w-full h-full rounded-lg overflow-hidden ${className ?? ""}`}
    >
      {/* 스켈레톤: 로딩 중이거나 실패 상태면 보임 */}
      {(!loaded || failed) && (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* 실제 이미지: 로드되면 보이고, 실패시 숨김 */}
      {!failed && (
        <img
          src={currentSrc}
          alt={alt ?? "photo"}
          onLoad={onLoad}
          onError={onError}
          className={`object-cover w-full h-full ${
            loaded ? "block" : "hidden"
          }`}
        />
      )}
    </div>
  );
}
