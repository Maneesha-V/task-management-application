import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import TYPES from "../config/inversify/types";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import type { IAuthService } from "./interfaces/IAuthService";
import type { IUser } from "../models/User.model";
import type {
  AuthResult,
  AuthTokens,
  RefreshResult,
} from "../types/authTypes";
import { ApiError } from "../utils/ApiError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { UserMapper } from "../mappers/UserMapper";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  private async issueTokens(user: IUser): Promise<AuthTokens> {
    const userId = String(user._id);
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    await this.userRepository.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) throw new ApiError(400, "Name is required");
    if (!EMAIL_REGEX.test(cleanEmail)) throw new ApiError(400, "Invalid email address");
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new ApiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const existingUser = await this.userRepository.findByEmail(cleanEmail);
    if (existingUser) throw new ApiError(409, "Email already exists");

    const user = await this.userRepository.create({
      name: cleanName,
      email: cleanEmail,
      password: await bcrypt.hash(password, 10),
    });

    const tokens = await this.issueTokens(user);

    return { 
      user: UserMapper.mapUserDTO(user), 
      ...tokens 
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email.trim().toLowerCase(), true);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    const tokens = await this.issueTokens(user);
    return { user: UserMapper.mapUserDTO(user), ...tokens };
  }

  async logout(token?: string): Promise<void> {
    if (!token) return;

    let userId: string;
    try {
      userId = verifyRefreshToken(token).userId;
    } catch {
      return; 
    }
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(token?: string): Promise<RefreshResult> {
    if (!token) throw new ApiError(401, "Refresh token missing");

    const { userId } = verifyRefreshToken(token);
    const user = await this.userRepository.findById(userId);

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, "Invalid refresh token");
    }

    return {
      accessToken: generateAccessToken(userId),
      user: UserMapper.mapUserDTO(user),
    };
  }
}