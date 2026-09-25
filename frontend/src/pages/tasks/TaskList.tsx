import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadTasks } from "../../features/tasks/tasksSlice";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  return (
    <div>
      <TaskForm />

      {status === "loading" && (
        <p className="text-sm text-stone-400">Loading...</p>
      )}
      {/* {status === "failed" && <p className="text-sm text-red-600">{error}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>} */}
      <ul className="flex flex-col gap-3">
        {items.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>

      {status === "succeeded" && items.length === 0 && (
        <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
          Nothing here yet. Add your first task above.
        </p>
      )}
    </div>
  );
};

export default TaskList;
