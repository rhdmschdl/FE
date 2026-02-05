import MainNavbar from "@/components/MainNavbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
