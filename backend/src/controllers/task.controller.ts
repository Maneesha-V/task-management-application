import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import type { ITaskService } from "../services/interfaces/ITaskService";
import { getIO } from "../socket/socket";
import { ApiError } from "../utils/ApiError";
import { ITaskController } from "./interfaces/ITaskController";
import { IStatsService } from "../services/interfaces/IStatsService";

@injectable()
export class TaskController implements ITaskController {
  constructor(
    @inject(TYPES.TaskService)
    private readonly taskService: ITaskService,
    @inject(TYPES.StatsService)
    private readonly statsService: IStatsService,
  ) {}

  private getOwner(req: Request): string {
    const owner = req.user?.userId;
    if (!owner) throw new ApiError(401, "Unauthorised access.");
    return owner;
  }

  private getTaskId(req: Request): string {
    const id = req.params.id;
    if (!id || Array.isArray(id)) throw new ApiError(400, "Task ID is required");
    return id;
  }

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasks(this.getOwner(req));
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.getTaskById(
        this.getTaskId(req),
        this.getOwner(req),
      );
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = this.getOwner(req);
      const task = await this.taskService.createTask(owner, req.body);
      this.notify(owner, "taskCreated", task);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = this.getOwner(req);
      const task = await this.taskService.updateTask(
        this.getTaskId(req),
        owner,
        req.body,
      );
      this.notify(owner, "taskUpdated", task);
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = this.getOwner(req);
      const taskId = this.getTaskId(req);
      await this.taskService.deleteTask(taskId, owner);
      this.notify(owner, "taskDeleted", { id: taskId });
      res.json({ message: "Task deleted", id: taskId });
    } catch (err) {
      next(err);
    }
  };

  private notify(userId: string, event: string, payload: unknown): void {
    const io = getIO();
    io.to(userId).emit(event, payload);
    this.statsService
      .getTaskStats(userId)
      .then((stats) => io.to(userId).emit("statsUpdated", stats))
      .catch((err) => console.error("Failed to emit stats:", err));
  }
}