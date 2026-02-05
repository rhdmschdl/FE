import { useNavigate, useParams } from "react-router-dom";
import { BtnIcon } from "@/components/common/Button/Btn";
import profileImage from "../../assets/images/profile.png";
import { PlusIcon, CheckIcon, XIcon } from "lucide-react";
import footerImage from "../../assets/images/footer.png";
import { usePostSendFriend } from "@/apis/mutations/friend/usePostFriend";
import { useDeleteSendFriend } from "@/apis/mutations/friend/useDeleteFriend";
import { useGetUser } from "@/apis/queries/user/useGetUser";
import { useGetStatusFriend } from "@/apis/queries/friend/useGetFriend";
import { FriendStatus } from "@/enums/friendStatus";

export default function VisitProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const userIdNum = userId ? Number(userId) : 0;

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUser({
    userId: userIdNum,
  });

  const { data: friendStatus, isLoading: isStatusLoading } = useGetStatusFriend({
    friendId: userIdNum,
  });

  const { mutate: sendFriendRequest, isPending: isSending } = usePostSendFriend();
  const { mutate: cancelFriendRequest, isPending: isCanceling } = useDeleteSendFriend();

  const handleSendFriendRequest = () => {
    if (!userIdNum) return;
    sendFriendRequest({ friendId: userIdNum });
  };

  const handleCancelFriendRequest = () => {
    if (!userIdNum) return;
    cancelFriendRequest({ friendId: userIdNum });
  };

  const isLoading = isUserLoading || isStatusLoading;

  if (isLoading) {
    return (
      <div className="px-8 py-12">
        <div className="w-310 mx-auto">로딩 중...</div>
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="px-8 py-12">
        <div className="w-310 mx-auto">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const status = friendStatus?.status;
  const isAlreadyFriend = status === FriendStatus.ACCEPTED;
  const isPendingRequest = status === FriendStatus.PENDING;

  const getButtonConfig = () => {
    if (isAlreadyFriend) {
      return {
        variant: "gray" as const,
        disabled: true,
        label: "친구",
        icon: <CheckIcon className="w-6 h-6 text-color-high" />,
        onClick: () => { },
      };
    }
    if (isPendingRequest) {
      return {
        variant: "gray" as const,
        disabled: isCanceling,
        label: "요청 취소",
        icon: <XIcon className="w-6 h-6 text-color-high" />,
        onClick: handleCancelFriendRequest,
      };
    }
    return {
      variant: "blue" as const,
      disabled: isSending,
      label: "친구 추가",
      icon: <PlusIcon className="w-6 h-6 text-color-high" />,
      onClick: handleSendFriendRequest,
    };
  };

  const buttonConfig = getButtonConfig();

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
      <div className="w-310 mx-auto">
        <div className="typo-h1 text-color-highest my-15">
          {user.nickname} 님의 페이지
        </div>

        {/* 프로필 영역 */}
        <div className="flex items-center gap-5 mb-15">
          {/* TODO: 백엔드에서 profileImageUrl 추가 시 적용 */}
          {/* <img src={user?.profileImageUrl || profileImage} className="size-30" /> */}
          <img src={profileImage} className="size-30" />
          <div className="flex flex-col gap-5">
            <div className="typo-h1 text-high">{user.nickname}</div>
            <div className="flex flex-col gap-3">
              {/* 친구 추가/취소 버튼 */}
              <BtnIcon
                variant={buttonConfig.variant}
                onClick={buttonConfig.onClick}
                disabled={buttonConfig.disabled}
                className={
                  buttonConfig.variant === "gray" && !isPendingRequest
                    ? "w-30 opacity-80"
                    : "w-30 border-2 border-border-low"
                }
                startIcon={buttonConfig.icon}
              >
                {buttonConfig.label}
              </BtnIcon>
            </div>
          </div>
        </div>

        {/* 아카이브 방문 버튼 */}
        <button
          type="button"
          onClick={() => navigate(`/profile/${userId}/archives`)}
          className="w-full flex items-center justify-between px-30 py-25 bg-white rounded-xl hover:bg-surface-container-20 focus:outline-none"
        >
          <div className="typo-h2-semibold text-color-mid">
            {user.nickname} 님의 아카이브 방문하기
          </div>

          {/* 다음 화살표 */}
          <svg
            className="size-8 text-color-mid"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
