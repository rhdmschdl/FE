import { useQuery } from "@tanstack/react-query";
import { socialLoginGetMe } from "@/apis/queries/auth/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useSocialAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["me"],
    queryFn: socialLoginGetMe,
    enabled: isAuthenticated, // 인증된 경우에만 실행
    retry: false, // 401 에러 시 재시도 안 함
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        nickname: data.user.nickname,
        role: data.user.role,
      });
    }
    if (isError) {
      useAuthStore.getState().clearAuth();
    }
  }, [isSuccess, data, setUser, isError]);

  return { isLoading };
};
