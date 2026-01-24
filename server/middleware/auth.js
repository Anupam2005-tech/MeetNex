// middleware/auth.js
const { verifyToken } = require("@clerk/backend");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error("Verify user error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireAuth;
