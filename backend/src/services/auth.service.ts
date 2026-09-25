import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      throw new ApiError(401, "Failed to create user.");
    }
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return {
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  }
  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const accessToken = generateAccessToken(user._id.toString());

    const refreshToken = generateRefreshToken(user._id.toString());

    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    const updatedUser = await this.userRepository.findById(user._id.toString());

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
  async logout(token: string) {
    if (!token) {
      throw new ApiError(401, "Refresh token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };

    await this.userRepository.updateRefreshToken(decoded.userId, null);

    return {
      message: "Logout successful",
    };
  }
  async refreshToken(token: string) {
    if (!token) {
      throw new ApiError(401, "Refresh token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };

    const user = await this.userRepository.findById(decoded.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== token) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(user._id.toString());

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
}
