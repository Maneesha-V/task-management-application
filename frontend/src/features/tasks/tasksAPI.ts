import axiosInstance from "../../api/axiosInstance";
import type { Task, TaskInput, TaskStatistics } from "../../types/taskTypes";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await axiosInstance.get<Task[]>("/tasks");
  return res.data;
};

export const createTaskAPI = async (data: TaskInput): Promise<Task> => {
  const res = await axiosInstance.post<Task>("/tasks", data);
  return res.data;
};

export const updateTaskAPI = async (
  id: string,
  data: Partial<TaskInput>
): Promise<Task> => {
  const res = await axiosInstance.put<Task>(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTaskAPI = async (id: string): Promise<string> => {
  await axiosInstance.delete(`/tasks/${id}`);
  return id;
};
export const getTaskStatistics = async (): Promise<TaskStatistics> => {
  const response = await axiosInstance.get("/tasks/statistics");

  return response.data;
};