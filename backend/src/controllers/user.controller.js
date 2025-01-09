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

export { getAllUsers };
