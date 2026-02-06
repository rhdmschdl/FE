import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { socialLoginGetMe } from "@/apis/queries/auth/user";
import { useAuthStore } from "@/store/useAuthStore";

const SocialCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const loginUser = useAuthStore((state) => state.login);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // ✅ Writer Hooby : 로그아웃 콜백인지 확인 (경로 또는 URL 파라미터로 구분)
  // 백엔드가 /logged-out으로 리다이렉트하거나, URL 파라미터로 구분
  const isLogoutCallback = location.pathname === "/logged-out" ||
    searchParams.get("logout") === "true" ||
    searchParams.get("action") === "logout";

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["me"],
    queryFn: socialLoginGetMe,
    retry: false,
    enabled: !isLogoutCallback, // 로그아웃 콜백인 경우 쿼리 비활성화
  });

  useEffect(() => {
    // 로그아웃 콜백 처리
    if (isLogoutCallback) {
      clearAuth();
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("provider");
      localStorage.removeItem("loginType");
      navigate("/login", { replace: true });
      return;
    }
    // 로그인 성공 처리
    if (isSuccess && data) {
      // ✅ Writer Hooby : 소셜 로그인 성공 시 provider 정보 확인 및 저장
      // URL 파라미터에서 provider를 가져오거나, localStorage에서 가져옴
      const providerFromUrl = searchParams.get("provider");
      const provider = providerFromUrl || localStorage.getItem("provider");

      if (provider) {
        localStorage.setItem("provider", provider);
        localStorage.setItem("loginType", "SOCIAL");
      }
      loginUser({
        id: data.user.id,
        email: data.user.email,
        nickname: data.user.nickname,
        role: data.user.role,
      });
      navigate("/");
    }
    //로그인 실패 처리 401등 - 카카오 로그아웃 콜백일 가능성도 있음.
    if (isError) {
      navigate("/login");
      clearAuth();
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("provider");
      localStorage.removeItem("loginType");
      navigate("/login", { replace: true });
    }

  }, [isSuccess, isError, data, loginUser, navigate, clearAuth, isLogoutCallback, searchParams, location]);
  return <div>소셜 로그인 처리 중...</div>;
};

export default SocialCallback;
