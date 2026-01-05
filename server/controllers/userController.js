const {  clerkClient } = require("@clerk/express")
const UserModel = require("../models/userdb");

const syncUserToDb = async (req, res) => {
    const userId = req.authUserId
    try {
        const clerkUser = await clerkClient.users.getUser(userId)
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const name = clerkUser.fullName || "";
        await UserModel.findOneAndUpdate(
            { clerkId: userId },
            { clerkId: userId, email, name },
            { upsert: true, new: true }
        )
        return res.status(200).json({ message: "User synced!" });
    } catch(err){
        console.error("Sync failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports=syncUserToDb