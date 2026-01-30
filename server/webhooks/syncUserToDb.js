const { clerkClient } = require("@clerk/express");
const UserModel = require("../models/userdb");

const syncUserToDb = async (req, res) => {
  try {
    const userId = req.authUserId;
    const user = await clerkClient.users.getUser(userId);

    await UserModel.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
      },
      { upsert: true }
    );

    res.status(200).json({ message: "User synced" });
  } catch (err) {
    res.status(500).json({ message: "Sync failed" });
  }
};

module.exports = syncUserToDb;
