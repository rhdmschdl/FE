import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSseSubscribe } from "@/apis/queries/sse/useSseSubscribe";

/**
 * SSE 구독을 관리하는 Provider
 *
 * 새로운 SSE 엔드포인트 추가 시 이 Provider에서 해당 훅을 호출하면 됩니다.
 * 예시:
 *   useSseSubscribe({ enabled: isAuthenticated });      // 알림 구독
 */
const SseProvider = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useSseSubscribe({ enabled: isAuthenticated });
  // TODO: 리포스트 구독 훅 추가 예정

  return <>{children}</>;
};

export default SseProvider;
