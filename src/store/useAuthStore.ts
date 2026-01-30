import { create } from "zustand";
import { persist } from "zustand/middleware";

// 사용자 정보 타입
export type User = {
  id: number;
  email: string;
  nickname: string;
  role: string;
};

// Auth Store 타입
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User) => void; // ✅ 토큰 파라미터 제거
  logout: () => void;
  setUser: (user: User) => void;
  clearAuth: () => void; // ✅ 추가: 클라이언트 상태만 초기화
};

// Zustand Store with persist (로컬 스토리지에 저장)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // 로그인 (쿠키는 서버에서 자동으로 설정됨)
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // 로그아웃 (클라이언트 상태 초기화, 쿠키는 서버에서 삭제)
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      // 사용자 정보 업데이트
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // 인증 상태 완전 초기화
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // 로컬 스토리지 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // ✅ 토큰 제거 (쿠키는 저장하지 않음)
      }),
    }
  )
);
