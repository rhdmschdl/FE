import MainNavbar from "@/components/MainNavbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // ✅ 로그인된 사용자는 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-full">
      <MainNavbar />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
