import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBadge from "@/components/common/ProfileBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import footerImage from "../../assets/images/footer.png";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { logout, withdraw } from "@/apis/mutations/auth/logout";

function maskEmail(email?: string | null) {
  if (!email) return "";
  // 간단 마스킹: 앞 2글자 보이고 그 뒤 5개 * 표시 후 끝 2자리 보이기
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const prefix = local.slice(0, Math.min(2, local.length));
  const suffix = local.length > 2 ? local.slice(-2) : "";
  const maskedMiddle =
    local.length > 4
      ? "*".repeat(5)
      : "*".repeat(Math.max(1, local.length - prefix.length - suffix.length));
  return `${prefix}${maskedMiddle}${suffix}@${domain}`;
}

export default function MyInfoPage() {
  const currentUser = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  // 닉네임 편집
  const [isEditingName, _setIsEditingName] = useState(false);
  const [_nameInput, setNameInput] = useState<string>(
    currentUser?.nickname ?? ""
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 모달 제어(로그아웃, 회원탈퇴)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const logoutUser = useAuthStore((state) => state.logout);

  // 로그아웃 뮤테이션
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("로그아웃 성공");
      logoutUser();
      localStorage.removeItem("auth-storage");
      navigate("/login");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      console.log("회원탈퇴 성공");
      logoutUser();
      localStorage.removeItem("auth-storage");
      navigate("/");
    },
    onError: (error) => {
      console.error("회원탈퇴 실패:", error);
    },
  });
  // API 호출
  useEffect(() => {
    setNameInput(currentUser?.nickname ?? "");
  }, [currentUser?.nickname]);

  useEffect(() => {
    if (isEditingName) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditingName]);

  const handleLogoutConfirm = () => {
    logoutMutation.mutate();
  };

  const handleWithdrawConfirm = async () => {
    withdrawMutation.mutate();
  };

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
          <h1 className="typo-h1 text-color-highest">내 정보</h1>
        </div>

        {/* 프로필 배지 + 닉네임(편집) */}
        <div className="flex items-center gap-6 mb-8">
          <ProfileBadge
            avatarUrl={undefined}
            displayName={currentUser?.nickname}
            size="lg"
            className="gap-5"
            nameClassName="typo-h1 text-color-high"
            editable={true}
            onRename={async (_next) => {
              // 프로젝트 API 함수로 교체
              try {
                // await api.updateNickname(next);
                // 성공하면 사용자 정보 갱신(refetch)
                // await refetchUser();
              } catch (err) {
                // 에러 처리
                console.error(err);
                throw err; // ProfileBadge가 alert을 띄울 수 있도록 예외 재전달
              }
            }}
          />
        </div>

        {/* 이메일 블록 */}
        <div className="bg-white rounded-xl px-30 py-25 mb-15">
          <div className="flex items-center gap-25 typo-h2-semibold">
            <div className="text-color-high">이메일</div>
            <div className="text-color-mid">
              {maskEmail(currentUser?.email)}
            </div>
          </div>
        </div>

        <div className="flex gap-15 justify-end items-center">
          {/* 로그아웃 */}
          <ConfirmModal
            trigger={
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="typo-body2-semibold text-color-low hover:underline"
              >
                로그아웃
              </button>
            }
            open={logoutModalOpen}
            onOpenChange={(v) => setLogoutModalOpen(v)}
            title="로그아웃하시겠습니까?"
            description={null}
            confirmLabel="확인"
            cancelLabel="취소"
            onConfirm={handleLogoutConfirm}
            onCancel={() => setLogoutModalOpen(false)}
          ></ConfirmModal>

          {/* 회원탈퇴 */}
          <ConfirmModal
            trigger={
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(true)}
                className="typo-body2-semibold text-color-low hover:underline"
              >
                회원탈퇴
              </button>
            }
            open={withdrawModalOpen}
            onOpenChange={(v) => setWithdrawModalOpen(v)}
            title="정말 탈퇴하시겠습니까?"
            description={
              <div>
                탈퇴시 모든 이용 기록과 작성하신 내용은 삭제되며 복구할 수
                없습니다.
              </div>
            }
            confirmLabel="확인"
            cancelLabel="취소"
            confirmVariant="blue"
            onConfirm={handleWithdrawConfirm}
            onCancel={() => setWithdrawModalOpen(false)}
            ariaLabel="회원탈퇴 확인"
          />
        </div>
      </div>
    </div>
  );
}
