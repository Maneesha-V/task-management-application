import { Router } from "express";
import {
  TaskController,
} from "../controllers/task.controller";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const taskController = container.get<TaskController>(
  TYPES.TaskController
);

router.get("/", authenticate, taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", authenticate, taskController.createTask);
router.put("/:id", authenticate, taskController.updateTask);
router.delete("/:id", authenticate, taskController.deleteTask);

export default router;
