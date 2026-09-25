import type { Task, TaskStatus } from "../../types/taskTypes";
import { useAppDispatch } from "../../app/hooks";
import { editTask, removeTask } from "../../features/tasks/tasksSlice";
import { useState } from "react";
import toast from "react-hot-toast";

const statusDot: Record<TaskStatus, string> = {
  todo: "bg-status-todo",
  "in-progress": "bg-status-progress",
  done: "bg-status-done",
};

const statusBorder: Record<TaskStatus, string> = {
  todo: "border-l-status-todo",
  "in-progress": "border-l-status-progress",
  done: "border-l-status-done",
};

const statusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const isOverdue = (dueDate?: string) =>
  !!dueDate && new Date(dueDate) < new Date(new Date().toDateString());

const TaskItem = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : "",
  );

  const inputClass =
    "rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  const handleSave = async () => {
    try {
    await dispatch(
      editTask({
        id: task._id,
        data: { title, description, status, dueDate: dueDate || undefined },
      }),
    ).unwrap();
    setIsEditing(false);
  } catch(err: any){
    toast.error(err)
  }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setIsEditing(false);
  };
    const handleDelete = async () => {
      try {
        await dispatch(removeTask(task._id)).unwrap();
        toast.success("Task Deleted succesfully")
      } catch(err: any){
        toast.error(err)
      }
  };

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-surface p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Title"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Description"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={`${inputClass} flex-1`}
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`${inputClass} flex-1`}
          />
        </div>
        <div className="mt-1 flex gap-2">
          <button
            onClick={handleSave}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
     <li
      className={`flex flex-col gap-3 rounded-lg border border-slate-700 border-l-4 bg-surface p-4 sm:flex-row sm:items-start sm:justify-between ${statusBorder[task.status]}`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${statusDot[task.status]}`}
          />
          <span className="truncate font-medium text-ink">{task.title}</span>
          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">
            {statusLabel[task.status]}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-slate-400">{task.description}</p>
        )}
        {task.dueDate && (
          <p
            className={`mt-1 text-xs ${
              isOverdue(task.dueDate) && task.status !== "done" ? "text-red-400" : "text-slate-500"
            }`}
          >
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-red-950 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
