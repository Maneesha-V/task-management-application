import { Container } from "inversify";
import TYPES from "./types";
import { TaskController } from "../../controllers/task.controller";
import { TaskService } from "../../services/task.service";
import { TaskRepository } from "../../repositories/task.repository";
import { UserRepository } from "../../repositories/user.repository";
import { AuthService } from "../../services/auth.service";
import { AuthController } from "../../controllers/auth.controller";
import { StatsService } from "../../services/stats.service";
import { StatsController } from "../../controllers/stats.controller";

const container = new Container();

// Repository
container
  .bind(TYPES.UserRepository)
  .to(UserRepository);
container
  .bind(TYPES.TaskRepository)
  .to(TaskRepository);

// Service
container
  .bind(TYPES.AuthService)
  .to(AuthService);
container
  .bind(TYPES.StatsService)
  .to(StatsService);
container 
  .bind(TYPES.TaskService)
  .to(TaskService);

// Controller
container
  .bind(TYPES.AuthController)
  .to(AuthController);
container
  .bind(TYPES.StatsController)
  .to(StatsController);
container 
  .bind(TYPES.TaskController)
  .to(TaskController);

export default container;