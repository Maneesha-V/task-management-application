import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { TaskService } from "../services/task.service";
import { getIO } from "../socket/socket";

@injectable()
export class TaskController {
  constructor(
    @inject(TYPES.TaskService)
    private readonly taskService: TaskService,
  ) {}
  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });
      const tasks = await this.taskService.getTasks(owner);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };
  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      console.log(req.user);
      const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });
      
      const { title, status, dueDate } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });
      if (!status)
        return res.status(400).json({ message: "Status is required" });
      if (!dueDate)
        return res.status(400).json({ message: "Due date is required" });
      if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
        return res
          .status(400)
          .json({ message: "Due date cannot be in the past" });
      }
      const task = await this.taskService.createTask({...req.body, owner});
      if (owner) {
        getIO().to(owner).emit("taskCreated", task);
      }
      res.status(201).json(task);
    } catch (err) {
      console.error(err);

      next(err);
    }
  };
  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id as string;
      const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });

      if (!taskId) {
        return res.status(404).json({ message: "Task ID is required" });
      }
      const task = await this.taskService.deleteTask(taskId, owner);
      if (!task) return res.status(404).json({ message: "Task not found" });

      if (owner) {
        getIO().to(owner).emit("taskDeleted", { id: taskId });
      }
      res.json({ message: "Task deleted", id: req.params.id });
    } catch (err) {
      console.log(err);
      
      next(err);
    }
  };
  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id as string;
            const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });
      if (!taskId) {
        return res.status(404).json({ message: "Task ID is required" });
      }
      const task = await this.taskService.getTaskById(taskId, owner);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (err) {
      next(err);
    }
  };
  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id as string;
        const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });
      if (!taskId) {
        return res.status(404).json({ message: "Task ID is required" });
      }
      const { title, status, dueDate } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });
      if (!status)
        return res.status(400).json({ message: "Status is required" });
      if (!dueDate)
        return res.status(400).json({ message: "Due date is required" });
      if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
        return res
          .status(400)
          .json({ message: "Due date cannot be in the past" });
      }
      const task = await this.taskService.updateTask(taskId, {...req.body,owner});
      if (!task) return res.status(404).json({ message: "Task not found" });
      if (owner) {
        getIO().to(owner).emit("taskUpdated", task);
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  };
}
