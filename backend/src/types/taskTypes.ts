export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string | Date;
  owner: string;
}

export interface ITaskStatistics {
  statusCounts: { _id: string; count: number }[];
  total: number;
  overdue: number;
}

export type TaskPayload = Omit<ITaskInput, "owner">;

export interface TaskStatsRes {
  total: number;
  byStatus: Record<TaskStatus, number>;
  overdue: number;
  completionRate: number;
}

export interface TaskDTO  {
  _id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: Date | string;
  owner: string;
}