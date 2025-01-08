import User from "../models/user.model.js";

async function authCallback(req, res) {
  const { id, firstName, lastName, imageUrl } = req.body;

  try {
    const user = User.findOne({ clerkId: id });

    if (!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in auth callback", error);

    res.status(500).json({ message: "Internal Server Error", error });
  }
}

export { authCallback };
