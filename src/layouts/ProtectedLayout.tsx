import MainNavbar from "@/components/MainNavbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { useSseSubscribe } from "@/apis/queries/sse/useSseSubscribe";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // SSE 전역 연결 - 로그인한 사용자만
  useSseSubscribe();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full h-full">
      <MainNavbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
