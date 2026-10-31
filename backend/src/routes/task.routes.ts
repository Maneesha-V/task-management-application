import { Router } from "express";
import TYPES from "../config/inversify/types";
import container from "../config/inversify/container";
import { authenticate } from "../middlewares/auth.middleware";
import { ITaskController } from "../controllers/interfaces/ITaskController";

const router = Router();

const taskController = container.get<ITaskController>(
  TYPES.TaskController
);

router.get("/", authenticate, taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", authenticate, taskController.createTask);
router.put("/:id", authenticate, taskController.updateTask);
router.delete("/:id", authenticate, taskController.deleteTask);

export default router;
