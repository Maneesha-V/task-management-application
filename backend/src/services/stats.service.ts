import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { TaskRepository } from "../repositories/task.repository";

@injectable()
export class StatsService {
  constructor(
    @inject(TYPES.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}
  async getTaskStats(owner: string) {
    const { statusCounts, total, overdue } =
      await this.taskRepository.getTaskStatistics(owner);
    // console.log({ statusCounts, total, overdue });

    const byStatus = { todo: 0, "in-progress": 0, done: 0 };
    statusCounts.forEach((row: { _id: string; count: number }) => {
      if (row._id in byStatus) {
        byStatus[row._id as keyof typeof byStatus] = row.count;
      }
    });

    return {
      total,
      byStatus,
      overdue,
      completionRate: total > 0 ? Math.round((byStatus.done / total) * 100) : 0,
    };
  }
}
