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
