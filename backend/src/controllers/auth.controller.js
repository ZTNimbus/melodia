import User from "../models/user.model.js";

async function authCallback(req, res, next) {
  const { id, firstName, lastName, imageUrl } = req.body;

  try {
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      const newUser = await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });

      await newUser.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);

    next(error);
  }
}

export { authCallback };
