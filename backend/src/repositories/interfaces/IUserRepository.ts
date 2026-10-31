import type { IBaseRepository } from "../interfaces/IBaseRepository";
import type { IUser } from "../../models/User.model";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string, includePassword?: boolean): Promise<IUser | null>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}