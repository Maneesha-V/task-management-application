export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string | Date;
  owner: string;
}
