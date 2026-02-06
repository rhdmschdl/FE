  import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { logout as logoutApi, getProviderLogoutUrls } from "@/apis/mutations/auth/logout";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

    // ✅ [추가] 클라이언트 상태만 정리하는 함수 (세션 만료용)
    const clearClientSession = useCallback(() => {
      clearAuth(); // Zustand Store 초기화
      localStorage.clear(); // 로컬스토리지 비우기
      navigate("/login", { replace: true });
    }, [clearAuth, navigate]);

  const handleLogout = useCallback(async () => {
    try {
        // 1. 로컬 스토리지에서 로그인 정보 확인
      // (로그인 시 또는 OAuth Callback 시점에 이 값들이 localStorage에 저장되어 있어야 함)
      const loginType = localStorage.getItem("loginType"); // 'SOCIAL' | 'GENERAL'
      const provider = localStorage.getItem("provider");   // 'kakao' | 'naver' | 'google' // 이거가 그 계정 연동 시 네이버 로그인하고 로그아웃했더니 카카오 로그아웃 뜨는 이슈때문에 필요
      
      let socialLogoutUrl: string | null = null;

      // 2. 카카오 계정인 경우에만 외부 로그아웃 URL 조회
      // 이떄 네이버/구글은 로그인 시 재인증(reauthenticate)을 강제했으므로 세션만 끊으면 됨
      if (loginType === "SOCIAL" && provider === "kakao") {
        try {
          const urls = await getProviderLogoutUrls();
          if (urls?.kakaoLogoutUrl) {
            socialLogoutUrl = urls.kakaoLogoutUrl;
          }
        } catch (error) {
          console.error("카카오 로그아웃 URL 확보 실패:", error);
          // 실패하더라도 내부 로그아웃은 진행
        }
      }
      // 3. 백엔드 로그아웃 요청 (HttpOnly 쿠키 삭제)
      await logoutApi();

      // 4. 클라이언트 상태 정리 (Store & LocalStorage)
      clearAuth(); // Zustand Store 초기화
      localStorage.clear(); // 싹 비움 (근데 제가 프론트는 잘 몰라서, 이거 뭐 필요한거만 지워야하면 필요한 것만 지우도록 수정하면 돼요
      // 소셜 로그아웃 URL이 있으면 리다이렉트
      
      // 5. 분기 처리
      if (socialLogoutUrl) {
        window.location.href = socialLogoutUrl;
      } else {
      navigate("/login", { replace: true });
      }
      

    } catch (error) {
      console.error("로그아웃 실패:", error);
      clearAuth();
      localStorage.clear(); // 에러 발생 시에도 UX를 위해 로컬 상태는 비우고 이동
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuth]);

  return { handleLogout, clearClientSession };
};