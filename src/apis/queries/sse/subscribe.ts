const BASE_URL = import.meta.env.VITE_API_BASE;

export const SSE_ENDPOINTS = {
  SUBSCRIBE: `${BASE_URL}/api/v1/notifications/subscribe`,
} as const;
