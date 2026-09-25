import { injectable } from "inversify";
import { Task } from "../models/Task.model";
import { ITaskInput } from "../types/taskTypes";
import mongoose from "mongoose";

@injectable()
export class TaskRepository {
  async getTasks(owner: string) {
    return await Task.find({owner}).sort({ createdAt: -1 });
  }
  async createTask(task: ITaskInput) {
    return await Task.create(task);
  }
  async deleteTask(taskId: string, owner: string) {
    const task = await Task.findOneAndDelete({_id: taskId, owner});
    return task;
  }
  async getTaskById(taskId: string, owner: string) {
    const task = await Task.findById(taskId, owner);
    return task;
  }
  async updateTask(taskId: string, taskData: ITaskInput) {
    return await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    });
  }
  async getTaskStatistics(owner: string) {
  const ownerId = new mongoose.Types.ObjectId(owner);
  const [statusCounts, total, overdue] = await Promise.all([
    Task.aggregate([
      { $match: {owner: ownerId}},
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.countDocuments({owner}),
    Task.countDocuments({
      owner,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" },
    }),
  ]);

  return { statusCounts, total, overdue };
}
}
