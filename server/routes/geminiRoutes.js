const express = require("express");
const { generateContent } = require("../controllers/geminiController");

const router = express.Router();

router.post("/chat", generateContent);

module.exports = router;
