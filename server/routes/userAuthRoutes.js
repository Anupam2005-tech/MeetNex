// routes/userAuthRoutes.js
const express = require("express");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/sync", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;

    res.json({
      message: "User synced",
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Sync failed" });
  }
});

module.exports = router;
