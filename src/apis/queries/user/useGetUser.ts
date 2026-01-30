import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import type { GetMeResponse, GetUserRequest, GetUserResponse } from "@/types/user";
import { getMe, getUser } from "./getUser";

export const useGetMe = () => {
  return useQuery<GetMeResponse>({
    queryKey: queryKeys.user.me(),
    queryFn: getMe,
    retry: false,
  });
};

export const useGetUser = (params: GetUserRequest) => {
  return useQuery<GetUserResponse>({
    queryKey: queryKeys.user.detail(params.userId),
    queryFn: () => getUser(params),
    enabled: !!params.userId,
    retry: false,
  });
};
