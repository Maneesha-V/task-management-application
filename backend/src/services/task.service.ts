import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import type { ITaskService } from "./interfaces/ITaskService";
import { ApiError } from "../utils/ApiError";
import { ITaskRepository } from "../repositories/interfaces/ITaskRepository";
import { TaskDTO, TaskPayload } from "../types/taskTypes";
import { TaskMapper } from "../mappers/TaskMapper";

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject(TYPES.TaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  private async validate(data: Partial<TaskPayload>, owner: string): Promise<void> {
    if (!data.title?.trim()) throw new ApiError(400, "Title is required");
    if (!data.status) throw new ApiError(400, "Status is required");
    if (!data.dueDate) throw new ApiError(400, "Due date is required");

    const today = new Date(new Date().toDateString());
    if (new Date(data.dueDate) < today) {
      throw new ApiError(400, "Due date cannot be in the past");
    }

    const exists = await this.taskRepository.existsByTitle(
      owner,
      data.title
    );
    if (exists)
      throw new ApiError(409, "A task with this title already exists");
  }

  async getTasks(owner: string): Promise<TaskDTO[]> {
    const tasks = await this.taskRepository.findAllByOwner(owner);
    return TaskMapper.mapTasksDTO(tasks);
  }

  async getTaskById(taskId: string, owner: string): Promise<TaskDTO> {
    const task = await this.taskRepository.findByIdAndOwner(taskId, owner);
    if (!task) throw new ApiError(404, "Task not found");
    return TaskMapper.mapTaskDTO(task);
  }

  async createTask(owner: string, data: TaskPayload): Promise<TaskDTO> {
    await this.validate(data, owner);
    const task = await this.taskRepository.createTask({ ...data, owner });
    return TaskMapper.mapTaskDTO(task);
  }

  async updateTask(
    taskId: string,
    owner: string,
    data: TaskPayload,
  ): Promise<TaskDTO> {
    await this.validate(data, owner);
    const task = await this.taskRepository.updateByIdAndOwner(
      taskId,
      owner,
      data,
    );
    if (!task) throw new ApiError(404, "Task not found");
    return TaskMapper.mapTaskDTO(task);
  }

  async deleteTask(taskId: string, owner: string): Promise<void> {
    const task = await this.taskRepository.deleteByIdAndOwner(taskId, owner);
    if (!task) throw new ApiError(404, "Task not found");
  }
}
