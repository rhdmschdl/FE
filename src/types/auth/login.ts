export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = {
  user: {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    nickname: string;
    createdAt: Date;
    lastModifiedAt: Date;
  };
  tokenExpiresInfo: {
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
};

export type SocialLoginGetMeResponse = {
  user: {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    nickname: string;
    createdAt: Date;
    lastModifiedAt: Date;
  };
  tokenExpiresInfo: {
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
};
