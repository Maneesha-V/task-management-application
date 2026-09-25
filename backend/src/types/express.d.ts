import "express";
import { UserRole } from "../types/authTypes";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
    };
  }
}

export {};