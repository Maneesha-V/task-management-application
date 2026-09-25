import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Called after login succeeds (or on app load if already authenticated)
export const connectSocket = (): Socket => {
  if (socket?.connected) return socket;

  const url = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
console.log("Socket URL:", url);
  socket = io(url, {
    withCredentials: true, // sends the httpOnly JWT cookie during the handshake
  });

  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = (): Socket | null => socket;
