export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export type UserInput = {
  name: string;
  email: string;
  password: string;
}
export interface JwtPayload {
  userId: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: UserDTO;
}

export interface RefreshResult {
  accessToken: string;
  user: UserDTO;
}

export interface UserDTO  {
  _id: string;
  name: string;
  email: string;
}