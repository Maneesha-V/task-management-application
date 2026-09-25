import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import authReducer from "../features/auth/authSlice";
import statsReducer from "../features/stats/statsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,  
    stats: statsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
