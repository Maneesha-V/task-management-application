import { Router } from "express";
import container from "../config/inversify/container";
import { AuthController } from "../controllers/auth.controller";
import TYPES from "../config/inversify/types";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const authController = container.get<AuthController>(
  TYPES.AuthController
);


router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post("/refresh-token", authController.refreshToken);

export default router;