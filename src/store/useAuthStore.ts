import { create } from "zustand";
import { persist } from "zustand/middleware";

// 사용자 정보 타입
type User = {
  id: number;
  email: string;
  nickname: string;
  role: string;
};

// Auth Store 타입
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loginTime: number | null; //로그인 시각

  // Actions
  login: (user: User) => void; // ✅ 토큰 파라미터 제거
  logout: () => void;
  setUser: (user: User) => void;
  clearAuth: () => void; // ✅ 추가: 클라이언트 상태만 초기화
  checkSessionExpiry: (expiryHours: number) => boolean; // ✅ 세션 만료 확인 함수
};

// export const SESSION_EXPIRY_HOURS = 0.001; // 약 3.6초 (테스트용)
export const SESSION_EXPIRY_HOURS = 24 * 7; // 7일 (실제 사용)

// Zustand Store with persist (로컬 스토리지에 저장)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loginTime: null,

      // 로그인 (쿠키는 서버에서 자동으로 설정됨)
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          loginTime: Date.now(),
        }),

      // 로그아웃 (클라이언트 상태 초기화, 쿠키는 서버에서 삭제)
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          loginTime: null,
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
          loginTime: null,
        }),
        // ✅ 세션 만료 확인 함수
      checkSessionExpiry: (expiryHours: number) => {
        const state = get();
        if (!state.isAuthenticated || !state.loginTime) {
          return false; // 로그인 안 한 상태면 만료 아님
        }

        const now = Date.now();
        const elapsedHours = (now - state.loginTime) / (1000 * 60 * 60);
        
        return elapsedHours > expiryHours; // 만료되었으면 true
      },
    }),
  
    {
      name: "auth-storage", // 로컬 스토리지 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
        // ✅ 토큰 제거 (쿠키는 저장하지 않음)
      }),
    }
  )
);
