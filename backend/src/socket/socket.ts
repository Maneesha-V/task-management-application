import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

let io: Server;

interface AuthedSocket extends Socket {
  userId?: string;
}

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });


  io.use((socket: AuthedSocket, next) => {
    try {
        // console.log("SOCKET HANDSHAKE COOKIE:", socket.handshake.headers.cookie);
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error("Not authenticated"));

      const parsed = cookie.parse(rawCookie);
      // console.log("PARSED COOKIE:", parsed);
      
      const token = parsed.refreshToken; 
      // console.log("REFRESH TOKEN:", token);
      if (!token) return next(new Error("Not authenticated"));
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };
    // console.log("SOCKET USER ID:", payload.userId);
      socket.userId = payload.userId;
      next();
    } catch(error) {
      console.error("SOCKET AUTH ERROR:", error);
      next(new Error("Invalid or expired session"));
    }
  });

  io.on("connection", (socket: AuthedSocket) => {
    console.log('Socket connected:', socket.userId)
    if (socket.userId) {
      socket.join(socket.userId); // private room, one per user
    }

    socket.on("disconnect", () => {
      // no-op for now; socket.io cleans up room membership automatically
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized — call initSocket first");
  }
  return io;
};
