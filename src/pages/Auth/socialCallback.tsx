import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { socialLoginGetMe } from "@/apis/queries/auth/user";
import { useAuthStore } from "@/store/useAuthStore";

const SocialCallback = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["me"],
    queryFn: socialLoginGetMe,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        nickname: data.user.nickname,
        role: data.user.role,
      });
      navigate("/");
    }

    if (isError) {
      navigate("/login");
    }
  }, [isSuccess, isError, data, setUser, navigate]);

  return <div>소셜 로그인 처리 중...</div>;
};

export default SocialCallback;
