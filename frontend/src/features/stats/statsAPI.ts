import axiosInstance from "../../api/axiosInstance";
import type { TaskStats } from "../../types/statsTypes";

export const fetchStatsAPI = async (): Promise<TaskStats> => {
  const res = await axiosInstance.get<TaskStats>("/stats/statistics");
  return res.data;
};
