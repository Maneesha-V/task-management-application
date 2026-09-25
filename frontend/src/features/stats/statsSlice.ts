import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TaskStats } from "../../types/statsTypes";
import { fetchStatsAPI } from "./statsAPI";

interface StatsState {
  data: TaskStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StatsState = {
  data: null,
  status: "idle",
  error: null,
};

// export const loadStats = createAsyncThunk("stats/loadStats", fetchStatsAPI);

export const loadStats = createAsyncThunk(
  "stats/loadStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStatsAPI();
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch dashboard",
      );
    }
  },
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load stats";
      });
  },
});

export default statsSlice.reducer;
