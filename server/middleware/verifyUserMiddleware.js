// middleware/verifyUser.js
const { verifyToken } = require("@clerk/backend");

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header present:", !!authHeader);
    console.log("Full path:", req.method, req.path);
    
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.authUserId = payload.sub; // used in roomController
    next();
  } catch (err) {
    console.error("Verify user error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyUser;
