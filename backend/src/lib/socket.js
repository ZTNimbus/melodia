import { Server } from "socket.io";
import Message from "../models/message.model.js";

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  //Connected users - {userId: socketId}
  const userSockets = new Map();

  //What users are currently doing - {userId: activity}
  const userActvities = new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActvities.set(userId, "Online");

      io.emit("user_connected", userId);

      socket.emit("users_online", Array.from(userSockets.keys()));

      io.emit("activities", Array.from(userActvities.entries()));
    });

    socket.on("update_activity", (userId, activity) => {
      userActvities.set(userId, activity);

      io.emit("activity_updated", userId, activity);
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        const receiverSocketId = userSockets.get(receiverId);

        if (receiverId)
          io.to(receiverSocketId).emit("receive_message", message);

        socket.emit("message_sent", message);
      } catch (error) {
        console.log("message error", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActvities.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
}

export { initSocket };
