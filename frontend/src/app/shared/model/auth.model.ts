export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  name: string;
  email: string;
}