import type { CookieOptions, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import type { IAuthService } from "../services/interfaces/IAuthService";
import type { IAuthController } from "./interfaces/IAuthController";
import { ApiError } from "../utils/ApiError";

const REFRESH_COOKIE = "refreshToken";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, { ...baseCookieOptions, maxAge: SEVEN_DAYS_MS });
  }

  private getRefreshToken(req: Request): string | undefined {
    const token: unknown = req.cookies?.[REFRESH_COOKIE];
    return typeof token === "string" ? token : undefined;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body ?? {};
      if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new ApiError(400, "Name, email and password are required");
      }

      const { user, refreshToken } = await this.authService.register(name, email, password);

      this.setRefreshCookie(res, refreshToken);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body ?? {};
      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new ApiError(400, "Email and password are required");
      }

      const { user, accessToken, refreshToken } = await this.authService.login(email, password);

      this.setRefreshCookie(res, refreshToken);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { accessToken, user },
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(this.getRefreshToken(req));

      res.clearCookie(REFRESH_COOKIE, baseCookieOptions);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, user } = await this.authService.refreshToken(
        this.getRefreshToken(req),
      );

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken, user },
      });
    } catch (err) {
      next(err);
    }
  };
}