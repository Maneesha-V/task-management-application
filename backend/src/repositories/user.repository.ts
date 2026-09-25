import { injectable } from "inversify";
import { IUser, User } from "../models/User.model";

@injectable()
export class UserRepository {
      async create(user: Partial<IUser>): Promise<IUser> {
    return await User.create(user);
  }
    async findByEmail (email: string) {
        return await User.findOne({email}).select("+password");
    }
      async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
   async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }
}