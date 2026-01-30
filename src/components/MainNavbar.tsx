import Logo from "@/assets/icon/Logo";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiaryColorStore } from "@/store/useDiaryColorStore";

const MainNavbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const color = useDiaryColorStore((state) => state.color);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-color-lowest" : "text-color-lowest opacity-[0.5]";

  return (
    // 홈, 아카이브, 커뮤니티, 피드 네비게이션 바
    <div
      className="typo-h3 flex h-20 px-20 py-7 justify-between items-center"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center gap-10">
        {/* 왼쪽 그룹 */}
        <ul className="flex h-10 items-center gap-10">
          <NavLink to="/">
            <Logo />
          </NavLink>
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/archive" className={linkClass}>
              Archive
            </NavLink>
          </li>
          <li>
            <NavLink to="/feed" className={linkClass}>
              Feed
            </NavLink>
          </li>
          <li>
            <NavLink to="/community" className={linkClass}>
              Community
            </NavLink>
          </li>
        </ul>
      </div>

      {/* 오른쪽 - 로그인 상태에 따라 다르게 표시 */}
      <div className="flex items-center gap-10">
        {isAuthenticated ? (
          // 로그인 O: 마이페이지만 표시
          <div>
            <NavLink to="/mypage" className={linkClass}>
              My page
            </NavLink>
          </div>
        ) : (
          // 로그인 X: 로그인, 회원가입 표시
          <>
            <div>
              <NavLink to="/login" className={linkClass}>
                로그인
              </NavLink>
            </div>
            <div>
              <NavLink to="/signup" className={linkClass}>
                회원가입
              </NavLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;
