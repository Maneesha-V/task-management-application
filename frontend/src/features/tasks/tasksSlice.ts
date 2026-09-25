import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskInput } from "../../types/taskTypes";
import {
  fetchTasks,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from "./tasksAPI";

interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
};

export const loadTasks = createAsyncThunk(
  "tasks/loadTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTasks();
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch tasks",
      );
    }
  },
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (data: TaskInput, { rejectWithValue }) => {
    try {
      return await createTaskAPI(data);
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to add task",
      );
    }
  },
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (
    { id, data }: { id: string; data: Partial<TaskInput> },
    { rejectWithValue },
  ) => {
    try {
      return await updateTaskAPI(id, data);
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to update task",
      );
    }
  },
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteTaskAPI(id);
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to delete task",
      );
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    taskAddedFromSocket(state, action: PayloadAction<Task>) {
      const alreadyExists = state.items.some(
        (t) => t._id === action.payload._id,
      );
      if (!alreadyExists) state.items.unshift(action.payload);
    },
    taskUpdatedFromSocket(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    taskDeletedFromSocket(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load tasks";
      })
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to add task";
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export const {
  taskAddedFromSocket,
  taskUpdatedFromSocket,
  taskDeletedFromSocket,
} = tasksSlice.actions;

export default tasksSlice.reducer;
