import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { TaskRepository } from "../repositories/task.repository";
import { ITaskInput } from "../types/taskTypes";
import { ApiError } from "../utils/ApiError";

@injectable()
export class TaskService {
  constructor(
    @inject(TYPES.TaskRepository)
    private readonly taskRepository: TaskRepository
  ) {}
  async getTasks(owner: string) {
    return await this.taskRepository.getTasks(owner)
  }
  async createTask(task: ITaskInput) {
    return await this.taskRepository.createTask(task)
  }
  async deleteTask(taskId: string, owner: string)  {
    return await this.taskRepository.deleteTask(taskId, owner)
  }
  async getTaskById(taskId: string, owner: string) {
     return await this.taskRepository.getTaskById(taskId, owner);
  }
  async updateTask(taskId: string, taskData: ITaskInput) {
    const task = await this.taskRepository.getTaskById(taskId, taskData.owner);
    if(!task) {
      throw new ApiError(404, "Task not found.")
    }
    return await this.taskRepository.updateTask(taskId, taskData)
  }
}