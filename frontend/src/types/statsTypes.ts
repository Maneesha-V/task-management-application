export interface TaskStats {
  total: number;
  byStatus: {
    todo: number;
    "in-progress": number;
    done: number;
  };
  overdue: number;
  completionRate: number;
}
