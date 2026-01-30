import { create } from "zustand";
import { SseConnectionStatus } from "@/enums/sseConnectionStatus";
import type { SseNotification } from "@/types/sse";

export type Notification = SseNotification & {
  id: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: SseConnectionStatus;

  // Actions
  addNotification: (notification: SseNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setConnectionStatus: (status: SseConnectionStatus) => void;
};

const MAX_NOTIFICATIONS = 100;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  connectionStatus: SseConnectionStatus.DISCONNECTED,

  addNotification: (sseNotification) => {
    const notification: Notification = {
      ...sseNotification,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const newNotifications = [notification, ...state.notifications].slice(
        0,
        MAX_NOTIFICATIONS
      );
      return {
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification || notification.isRead) return state;

      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const unreadDelta = notification && !notification.isRead ? 1 : 0;

      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: Math.max(0, state.unreadCount - unreadDelta),
      };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },
}));
