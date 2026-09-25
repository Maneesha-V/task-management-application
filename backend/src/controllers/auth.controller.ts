import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { AuthService } from "../services/auth.service";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Fields are required" });
      }

      const { user, accessToken, refreshToken } =
        await this.authService.register(name, email, password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
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
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await this.authService.login(email, password);
      res
        .status(200)
        .cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        })
        .json({
          success: true,
          message: "Login successful",
          data: {
            accessToken: result.accessToken,
            user: result.user,
          },
        });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;

      await this.authService.logout(token);

      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        })
        .status(200)
        .json({
          success: true,
          message: "Logged out successfully",
        });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Req",req.cookies);
    console.log("refreshToken",refreshToken);
    const user = req.user;
    console.log("user",user);
    
    const result = await this.authService.refreshToken(
      refreshToken
    );

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
          accessToken: result.accessToken,
          user: result.user,
        },
    });

  } catch(error) {
    console.error(error)
    next(error);
  }
};
}
