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
import { ITaskRepository } from "../../repositories/interfaces/ITaskRepository";
import { ITaskService } from "../../services/interfaces/ITaskService";
import { ITaskController } from "../../controllers/interfaces/ITaskController";
import { IStatsController } from "../../controllers/interfaces/IStatsController";
import { IAuthController } from "../../controllers/interfaces/IAuthController";
import { IStatsService } from "../../services/interfaces/IStatsService";
import { IAuthService } from "../../services/interfaces/IAuthService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

const container = new Container();

// Repository
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository);
container
.bind<ITaskRepository>(TYPES.TaskRepository)
.to(TaskRepository);

// Service
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService);
container
  .bind<IStatsService>(TYPES.StatsService)
  .to(StatsService);
container
.bind<ITaskService>(TYPES.TaskService)
.to(TaskService);

// Controller
container
  .bind<IAuthController>(TYPES.AuthController)
  .to(AuthController);
container
  .bind<IStatsController>(TYPES.StatsController)
  .to(StatsController);
container
.bind<ITaskController>(TYPES.TaskController)
.to(TaskController);

export default container;