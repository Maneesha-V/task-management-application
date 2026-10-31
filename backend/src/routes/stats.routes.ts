import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import container from "../config/inversify/container";
import TYPES from "../config/inversify/types";
import { IStatsController } from "../controllers/interfaces/IStatsController";

const router = Router();

const statsController = container.get<IStatsController>(
  TYPES.StatsController
);

router.get("/statistics", authenticate, statsController.getTaskStats);

export default router;