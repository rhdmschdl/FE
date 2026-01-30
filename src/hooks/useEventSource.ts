import { useEffect, useRef, useState } from "react";
import { SseConnectionStatus } from "@/enums/sseConnectionStatus";

type UseEventSourceOptions<T> = {
  url: string;
  enabled?: boolean;
  withCredentials?: boolean;
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  reconnectOnError?: boolean;
  reconnectInterval?: number;
  parseMessage?: (event: MessageEvent) => T;
  eventTypes?: string[];
};

type UseEventSourceReturn<T> = {
  status: SseConnectionStatus;
  lastMessage: T | null;
  connect: () => void;
  disconnect: () => void;
};

export const useEventSource = <T = unknown>(
  options: UseEventSourceOptions<T>
): UseEventSourceReturn<T> => {
  const {
    url,
    enabled = true,
    withCredentials = true,
    onMessage,
    onError,
    onOpen,
    reconnectOnError = true,
    reconnectInterval = 3000,
    parseMessage = (event) => JSON.parse(event.data) as T,
    eventTypes = [],
  } = options;

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [status, setStatus] = useState<SseConnectionStatus>(
    SseConnectionStatus.DISCONNECTED
  );
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  // 옵션들을 ref로 저장
  const optionsRef = useRef({
    url,
    withCredentials,
    reconnectOnError,
    reconnectInterval,
    onMessage,
    onError,
    onOpen,
    parseMessage,
    eventTypes,
  });

  // 매 렌더마다 최신 값으로 업데이트
  useEffect(() => {
    optionsRef.current = {
      url,
      withCredentials,
      reconnectOnError,
      reconnectInterval,
      onMessage,
      onError,
      onOpen,
      parseMessage,
      eventTypes,
    };
  });

  // connect/disconnect를 ref로 관리
  const connectRef = useRef<() => void>(() => {});
  const disconnectRef = useRef<() => void>(() => {});

  disconnectRef.current = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setStatus(SseConnectionStatus.DISCONNECTED);
  };

  connectRef.current = () => {
    disconnectRef.current();
    setStatus(SseConnectionStatus.CONNECTING);

    const { url, withCredentials, reconnectOnError, reconnectInterval, eventTypes } =
      optionsRef.current;

    const eventSource = new EventSource(url, { withCredentials });
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setStatus(SseConnectionStatus.CONNECTED);
      optionsRef.current.onOpen?.();
    };

    // 이벤트 타입이 지정된 경우 addEventListener 사용
    const handleEvent = (event: MessageEvent) => {
      try {
        const data = optionsRef.current.parseMessage(event);
        setLastMessage(data);
        optionsRef.current.onMessage?.(data);
      } catch (error) {
        console.error("[SSE] 메시지 파싱 에러:", error);
      }
    };

    if (eventTypes.length > 0) {
      eventTypes.forEach((eventType) => {
        eventSource.addEventListener(eventType, handleEvent);
      });
    } else {
      eventSource.onmessage = handleEvent;
    }

    eventSource.onerror = (error: Event) => {
      setStatus(SseConnectionStatus.ERROR);
      optionsRef.current.onError?.(error);

      if (reconnectOnError) {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectRef.current();
        }, reconnectInterval);
      }
    };
  };

  useEffect(() => {
    if (enabled) {
      connectRef.current();
    } else {
      disconnectRef.current();
    }

    return () => {
      disconnectRef.current();
    };
  }, [enabled, url]);

  return {
    status,
    lastMessage,
    connect: () => connectRef.current(),
    disconnect: () => disconnectRef.current(),
  };
};
