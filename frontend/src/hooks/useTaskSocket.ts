import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { connectSocket, disconnectSocket } from "../socket/socket";
import {
  taskAddedFromSocket,
  taskUpdatedFromSocket,
  taskDeletedFromSocket,
} from "../features/tasks/tasksSlice";
import type { Task } from "../types/taskTypes";

// Connects once the user is authenticated, disconnects on logout/unmount.
export const useTaskSocket = () => {
  const dispatch = useAppDispatch();
  const { user, checkedAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("useTaskSocket ran:", { checkedAuth, user });
    if (!checkedAuth || !user) return;

    const socket = connectSocket();
    console.log("Socket instance:", socket.id, socket.connected);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connect_error:", err.message);
    });

    socket.on("taskCreated", (task: Task) => {
      console.log("Received taskCreated:", task);
      dispatch(taskAddedFromSocket(task));
    });

    socket.on("taskUpdated", (task: Task) => {
      console.log("Received taskUpdated:", task);
      dispatch(taskUpdatedFromSocket(task));
    });

    socket.on("taskDeleted", ({ id }: { id: string }) => {
      console.log("Received taskDeleted:", id);
      dispatch(taskDeletedFromSocket(id));
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      disconnectSocket();
    };
  }, [checkedAuth, user, dispatch]);
};
