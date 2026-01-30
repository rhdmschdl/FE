export type ResetPasswordRequest = {
  email: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};