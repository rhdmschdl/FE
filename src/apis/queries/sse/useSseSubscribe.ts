import { useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventSource } from "@/hooks/useEventSource";
import { useNotificationStore } from "@/store/useNotificationStore";
import { SseConnectionStatus } from "@/enums/sseConnectionStatus";
import { SseEventType } from "@/enums/sseEventType";
import { queryKeys } from "@/constants/queryKeys";
import { SSE_ENDPOINTS } from "@/apis/queries/sse/subscribe";
import type { SseNotification } from "@/types/sse";

type UseSseSubscribeOptions = {
  enabled?: boolean;
  onMessage?: (data: SseNotification) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  reconnectOnError?: boolean;
  reconnectInterval?: number;
};

export const useSseSubscribe = (options: UseSseSubscribeOptions = {}) => {
  const { onMessage, ...restOptions } = options;
  const queryClient = useQueryClient();
  const onMessageRef = useRef(onMessage);

  const { addNotification, setConnectionStatus } = useNotificationStore();

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  const handleMessage = (data: SseNotification) => {
    // 1. Store에 알림 추가
    addNotification(data);

    // 2. Friend query invalidation
    console.log("[SSE] 쿼리 초기화:", data.type);
    queryClient.invalidateQueries({ queryKey: queryKeys.friend.all });

    // 3. 사용자 콜백 실행
    onMessageRef.current?.(data);
  };

  const result = useEventSource<SseNotification>({
    url: SSE_ENDPOINTS.SUBSCRIBE,
    onMessage: handleMessage,
    onOpen: restOptions.onOpen,
    onError: restOptions.onError,
    enabled: restOptions.enabled,
    reconnectOnError: restOptions.reconnectOnError,
    reconnectInterval: restOptions.reconnectInterval,
    // TODO: 백엔드에서 FRIEND_DELETE 이벤트 추가 시 SseEventType.FRIEND_DELETE 추가
    eventTypes: [SseEventType.FRIEND_REQUEST, SseEventType.FRIEND_ACCEPT],
  });

  // 연결 상태 동기화
  useEffect(() => {
    setConnectionStatus(result.status);
  }, [result.status, setConnectionStatus]);

  return result;
};

export { SseConnectionStatus };
