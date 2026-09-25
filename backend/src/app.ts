import express, { Application } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import statsRoutes from "./routes/stats.routes";

const app: Application = express();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);

app.use(errorHandler);

export default app;
