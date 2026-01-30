import ProfileMenu from "@/components/mypage/ProfileMenu";
import type { ProfileMenuItem } from "@/components/mypage/ProfileMenu";
import ProfileBadge from "@/components/common/ProfileBadge";
import footerImage from "../../assets/images/footer.png";
import { useAuthStore } from "@/store/useAuthStore";

export default function MyPage() {
  const currentUser = useAuthStore((state) => state.user);

  const items: ProfileMenuItem[] = [
    {
      id: "info",
      title: "내 정보",

      to: "/mypage/info",
    },
    {
      id: "archive",
      title: "아카이브 관리",

      to: "/mypage/archive",
    },
    {
      id: "friends",
      title: "친구 관리",

      to: "/mypage/friends",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-surface-container-10"
      style={{
        backgroundImage: `url(${footerImage})`,
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="w-310">
        <div className="my-15">
          <div className="typo-h1 text-color-highest">마이페이지</div>
        </div>
        <ProfileBadge
          avatarUrl={undefined}
          displayName={currentUser?.nickname ?? "사용자명"}
          size="lg"
          className="gap-5"
          nameClassName="typo-h1 text-color-high"
        />
        <div className="mt-15 relative z-10">
          <ProfileMenu items={items} />
        </div>
      </div>
    </div>
  );
}
