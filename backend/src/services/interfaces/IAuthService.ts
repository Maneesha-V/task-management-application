import { AuthResult, RefreshResult } from "../../types/authTypes";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  logout(token?: string): Promise<void>;
  refreshToken(token?: string): Promise<RefreshResult>;
}