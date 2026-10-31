import { injectable } from "inversify";
import mongoose from "mongoose";
import type { ITaskRepository } from "./interfaces/ITaskRepository";
import { ITask, Task } from "../models/Task.model";
import type { ITaskInput, ITaskStatistics } from "../types/taskTypes";
import { BaseRepository } from "./base.repository";

@injectable()
export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor() {
    super(Task);
  }

  async createTask(data: ITaskInput): Promise<ITask> {
    return await this.create(data as unknown as Partial<ITask>);
  }

  async findAllByOwner(owner: string): Promise<ITask[]> {
    return await this.model.find({ owner }).sort({ createdAt: -1 });
  }

  async findByIdAndOwner(taskId: string, owner: string): Promise<ITask | null> {
    return await this.findOne({ _id: taskId, owner });
  }

  async updateByIdAndOwner(
    taskId: string,
    owner: string,
    data: Partial<ITaskInput>,
  ): Promise<ITask | null> {
    return await this.updateOne({ _id: taskId, owner }, data);
  }

  async deleteByIdAndOwner(taskId: string, owner: string): Promise<ITask | null> {
    return await this.deleteOne({ _id: taskId, owner });
  }

  async getTaskStatistics(owner: string): Promise<ITaskStatistics> {
    const ownerId = new mongoose.Types.ObjectId(owner);

    const [statusCounts, total, overdue] = await Promise.all([
      this.model.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      this.count({ owner }),
      this.count({
        owner,
        dueDate: { $lt: new Date() },
        status: { $ne: "done" },
      }),
    ]);

    return { statusCounts, total, overdue };
  }
}