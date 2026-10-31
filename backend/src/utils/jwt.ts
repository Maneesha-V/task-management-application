import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

export const generateRefreshToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};