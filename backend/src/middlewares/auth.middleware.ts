import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

interface TokenPayload {
  userId: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
  if (!token) {
      throw new ApiError(401, "Unauthorized");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as TokenPayload;
   if (!decoded.userId) {
      throw new ApiError(401, "Invalid token");
    }
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};