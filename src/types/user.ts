import type { UserRole } from "@/enums/userRole";

export type User = {
  id: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  isFriend?: boolean;
};

type UserId = {
  userId: number;
};

// 응닶 값에 아바타가 없음
type DefaultUserResponse = {
  id: number;
  email: string;
  role: UserRole;
  nickname: string | null;
  createdAt: string;
  lastModifiedAt: string;
};

export type GetMeRequest = void;
export type GetMeResponse = DefaultUserResponse;
export type UpdateMeRequest = {
  nickname?: string | null;
  password?: string; // 검증용인가???
};
export type UpdateMeResponse = DefaultUserResponse;
export type GetUserRequest = UserId;
export type GetUserResponse = DefaultUserResponse;
