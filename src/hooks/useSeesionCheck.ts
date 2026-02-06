import { useEffect } from "react";
import { useAuthStore, SESSION_EXPIRY_HOURS } from "@/store/useAuthStore";

export const useSessionCheck = () => {
  const { isAuthenticated, checkSessionExpiry, clearAuth, loginTime } = useAuthStore();

  useEffect(() => {

    // 세션 만료 확인
    const isExpired = checkSessionExpiry(SESSION_EXPIRY_HOURS);
    // console.log("  - isExpired:", isExpired);
    
    if (isExpired) {
      console.log("  ✅ 세션 만료 - 자동 로그아웃 실행");
      // 클라이언트 상태 정리
      clearAuth(); // Zustand Store 초기화
      localStorage.clear(); // 로컬스토리지 비우기
      
      // 알림 표시
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    } 
  }, [isAuthenticated, checkSessionExpiry, clearAuth, loginTime]);
};