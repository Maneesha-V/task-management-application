import { Schema, model, Document, Types } from "mongoose";
import { TaskStatus } from "../types/taskTypes";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  owner?: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: { type: Date },
    owner: { 
      type: Schema.Types.ObjectId, ref: "User" 
    },
  },
  { timestamps: true }
);

export const Task = model<ITask>("Task", taskSchema);
