import type { ITask } from "../../models/Task.model";
import type { ITaskInput, ITaskStatistics } from "../../types/taskTypes";
import { IBaseRepository } from "./IBaseRepository";



export interface ITaskRepository extends IBaseRepository<ITask> {
  createTask(data: ITaskInput): Promise<ITask>;
  existsByTitle(owner: string, title: string): Promise<boolean>;
  findAllByOwner(owner: string): Promise<ITask[]>;
  findByIdAndOwner(taskId: string, owner: string): Promise<ITask | null>;
  updateByIdAndOwner(taskId: string, owner: string, data: Partial<ITaskInput>): Promise<ITask | null>;
  deleteByIdAndOwner(taskId: string, owner: string): Promise<ITask | null>;
  getTaskStatistics(owner: string): Promise<ITaskStatistics>;
}