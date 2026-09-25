import { useState } from "react";
import type { SubmitEvent } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTask } from "../../features/tasks/tasksSlice";
import type { TaskStatus } from "../../types/taskTypes";
import toast from "react-hot-toast";

const TaskForm = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    await dispatch(
      addTask({ title, description, status, dueDate: dueDate || undefined }),
    ).unwrap();
    setTitle("");
    setDescription("");
    setStatus("todo");
    setDueDate("");
    } catch (err: any) {
      toast.error(err);
    }
  };
  const inputClass =
    "rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-ink placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-2 rounded-lg border border-slate-700 bg-surface p-4"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className={`${inputClass} flex-1`}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputClass} flex-1`}
        />
      </div>

      <button
        type="submit"
        className="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
