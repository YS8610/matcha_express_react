import { Server, Socket } from "socket.io";
import { clogger } from "../service/loggerSvc.js";
import { AuthToken } from "../model/token.js";
import { authWSmiddleware } from "../middleware/auth.js";
import ConstMatcha from "../ConstMatcha.js";
import { NotificationManager } from "../service/NotificationManager.js";

// Extend the Socket interface to include 'user'
declare module "socket.io" {
  interface Socket {
    user?: AuthToken;
  }
}

const eventHandlers = (io: Server) => {
  // Apply authentication middleware before handling connections
  io.use(authWSmiddleware);

  // Handle connection events
  io.on("connection", (socket: Socket) => {
    // Store the socket ID in a map with the user ID as the key and socket IDs as values
    if (socket.user)
      ConstMatcha.wsmap.set(socket.user.id, ConstMatcha.wsmap.get(socket.user.id)?.add(socket.id) ?? new Set([socket.id]));
    clogger.info(`[socket]: User connected: ${socket.id}`);

    // online status check 
    socket.on("isOnline", async (userIds: string[]) => {
      const onlineStatuses: Record<string, boolean> = {};
      for (const id of userIds)
        onlineStatuses[id] = ConstMatcha.wsmap.has(id);
      socket.emit("onlineStatus", onlineStatuses);
    });

    // Subscribe to notifications for this socket
    NotificationManager.getInstance().subscribe("event", (data) => {
      if (data.userId && ConstMatcha.wsmap.has(data.userId as string)) {
        for (const sockId of ConstMatcha.wsmap.get(data.userId as string) || [])
          io.to(sockId).emit("notification", data);
        return;
      }
      socket.emit("notification", data);
    });

    // Handle disconnection and remove the socket ID from the map
    socket.on("disconnect", () => {
      clogger.info(`[socket]: User disconnected: ${socket.id}`);
      if (socket.user) {
        const userSockets = ConstMatcha.wsmap.get(socket.user.id);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0)
            ConstMatcha.wsmap.delete(socket.user.id);
          else
            ConstMatcha.wsmap.set(socket.user.id, userSockets);
        }
      }
    });

    socket.on("error", (err) => {
      clogger.error(`[socket]: Error from ${socket.id}: ${err.message}`);
      socket.emit("error", { msg: err.message });
      if (err.message === "Authentication error")
        socket.disconnect();
    });
  });
};

export default eventHandlers;