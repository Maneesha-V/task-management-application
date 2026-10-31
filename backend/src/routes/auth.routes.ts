import { Router } from "express";
import container from "../config/inversify/container";
import TYPES from "../config/inversify/types";
import { IAuthController } from "../controllers/interfaces/IAuthController";

const router = Router();

const authController = container.get<IAuthController>(
  TYPES.AuthController
);


router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post("/refresh-token", authController.refreshToken);

export default router;