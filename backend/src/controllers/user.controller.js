import Message from "../models/message.model.js";
import User from "../models/user.model.js";

async function getAllUsers(req, res, next) {
  try {
    const currentUserId = req.auth.userId;

    const users = await User.find({ clerkId: { $ne: currentUserId } });

    res.status(200).json(users);
  } catch (error) {
    console.log("get all users error", error);

    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("get messages error", error);

    next(error);
  }
}

export { getAllUsers, getMessages };
