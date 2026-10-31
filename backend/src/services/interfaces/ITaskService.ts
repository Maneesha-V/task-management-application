import { ITask } from "../../models/Task.model";
import { TaskDTO, TaskPayload } from "../../types/taskTypes";

export interface ITaskService {
  getTasks(owner: string): Promise<TaskDTO[]>;
  getTaskById(taskId: string, owner: string): Promise<TaskDTO>;
  createTask(owner: string, data: TaskPayload): Promise<TaskDTO>;
  updateTask(taskId: string, owner: string, data: TaskPayload): Promise<TaskDTO>;
  deleteTask(taskId: string, owner: string): Promise<void>;
}