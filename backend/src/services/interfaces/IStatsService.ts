import { TaskStatsRes } from "../../types/taskTypes";

export interface IStatsService {
    getTaskStats(owner: string): Promise<TaskStatsRes>;
}
