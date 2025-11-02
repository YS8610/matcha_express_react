import { Server, Socket } from "socket.io";
import { clogger } from "../service/loggerSvc.js";
import { AuthToken } from "../model/token.js";
import { authWSmiddleware } from "../middleware/auth.js";
import ConstMatcha from "../ConstMatcha.js";
import { NotificationManager } from "../service/notificationSvc.js";
import { ChatMessage } from "../model/Response.js";
import { getBlockedRel } from "../service/blockSvc.js";
import { isMatch } from "../service/likeSvc.js";
import { getChatHistoryBetweenUsers, saveChatmsg } from "../service/chatSvc.js";
import { setLastOnlineById } from "../service/userSvc.js";
import { getDb } from "../repo/mongoRepo.js";

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
    });

    // chat message event
    socket.on("chatMessage", async (data: ChatMessage) => {
      if (!data.fromUserId || !data.toUserId || !data.content || !data.timestamp) {
        io.to(socket.id).emit("error", { msg: "Invalid chat message format" });
        return;
      }
      if (data.fromUserId == data.toUserId) {
        io.to(socket.id).emit("error", { msg: "Cannot send message to yourself" });
        return;
      }
      // check if recipent is not blocked
      const blockedBySender = await getBlockedRel(data.fromUserId, data.toUserId);
      if (blockedBySender) {
        io.to(socket.id).emit("error", { msg: "Cannot send message to this user due to blocked status" });
        return;
      }
      // check if sender is matched with recipient
      const isMatched = await isMatch(data.fromUserId, data.toUserId);
      if (!isMatched) {
        io.to(socket.id).emit("error", { msg: "Cannot send message to this user as you are not matched" });
        return;
      }
      // store message in db
      try {
        await saveChatmsg(getDb, data);
      } catch (err) {
        io.to(socket.id).emit("error", { msg: "Failed to store chat message" });
        return;
      }
      // send msg to recipient and user socket if online
      if (ConstMatcha.wsmap.has(data.toUserId as string))
        for (const sockId of ConstMatcha.wsmap.get(data.toUserId as string) || [])
          io.to(sockId).emit("serverChatmsg", data);
      if (ConstMatcha.wsmap.has(data.fromUserId as string))
        for (const sockId of ConstMatcha.wsmap.get(data.fromUserId as string) || [])
          io.to(sockId).emit("serverChatmsg", data);
    });

    // Handle disconnection and remove the socket ID from the map
    socket.on("disconnect", () => {
      clogger.info(`[socket]: User disconnected: ${socket.id}`);
      if (socket.user) {
        const userSockets = ConstMatcha.wsmap.get(socket.user.id);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0){
            ConstMatcha.wsmap.delete(socket.user.id);
            setLastOnlineById(socket.user.id, Date.now());
          }
          else
            ConstMatcha.wsmap.set(socket.user.id, userSockets);
        }
      }
    });

    // get chat history between two users using websocket
    socket.on("getChatHistory", async (data: { otherId: string, limit?: number, skipno?: number }) => {
      const { otherId, limit = 50, skipno = 0 } = data;
      const userId = socket.user?.id;
      if (!userId) {
        io.to(socket.id).emit("error", { message: "Authentication error" });
        return;
      }
      if (!otherId) {
        io.to(socket.id).emit("error", { message: "otherId is required" });
        return;
      }
      try {
        const chatHistory = await getChatHistoryBetweenUsers(getDb, userId, otherId, skipno, limit);
        for (const sId of ConstMatcha.wsmap.get(userId) || [])
          io.to(sId).emit("chatHistory", chatHistory);
      } catch (err) {
        io.to(socket.id).emit("error", { message: "Failed to retrieve chat history" });
      }
    });

    // Handle errors
    socket.on("error", (err) => {
      clogger.error(`[socket]: Error from ${socket.id}: ${err.message}`);
      socket.emit("error", { msg: err.message });
      if (err.message === "Authentication error")
        socket.disconnect();
    });
  });
};

export default eventHandlers;