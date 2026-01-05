const { getAuth } = require("@clerk/express");

const verifyUser = async (req, res, next) => {
    try {
        const auth = getAuth(req);
        const userId = auth && auth.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "User unauthorized" });
        }
        
        req.authUserId = userId;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = verifyUser;