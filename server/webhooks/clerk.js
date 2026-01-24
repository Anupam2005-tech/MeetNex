const { getAuth } = require("@clerk/express");

const verifyUser = (req, res, next) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.authUserId = userId;
  next();
};

module.exports = verifyUser;
