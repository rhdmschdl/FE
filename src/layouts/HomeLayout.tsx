import MainNavbar from "@/components/MainNavbar";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  // ✅ 인증 체크 완전히 제거
  return (
    <div className="w-full h-full">
      <MainNavbar />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
