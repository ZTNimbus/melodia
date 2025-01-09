import { clerkClient } from "@clerk/express";

function protectRoute(req, res, next) {
  if (!req.auth.userId)
    return res.status(401).json({ message: "Unauthorized - Login Required" });

  next();
}

async function requireAdmin(req, res, next) {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin)
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin Privilege Required" });

    next();
  } catch (error) {
    next(error);
  }
}

export { protectRoute, requireAdmin };
