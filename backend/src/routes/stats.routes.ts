import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import container from "../config/inversify/container";
import { StatsController } from "../controllers/stats.controller";
import TYPES from "../config/inversify/types";

const router = Router();

const statsController = container.get<StatsController>(
  TYPES.StatsController
);

router.get("/statistics", authenticate, statsController.getTaskStats);

export default router;