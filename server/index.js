const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const DbConnection = require("./config/db");
const clerkRoutes = require("./routes/userAuthRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const configureMiddleware = require("./middleware/appMiddleware");

const { setupSocketAuth } = require("./middleware/socketAuth");
const { initSocketManager } = require("./socket/socketManager");

const PORT = process.env.PORT || 5000;

const app = express();

/* ================= MIDDLEWARE ================= */
configureMiddleware(app);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* ================= DATABASE ================= */
DbConnection();

/* ================= ROUTES ================= */
app.use("/user", clerkRoutes);
app.use("/meeting", meetingRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

// 404 handler
app.use((req, res) => {
  console.log("Route not found:", req.path);
  res.status(404).json({ message: "Route not found" });
});

/* ================= HTTP + SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

/* SOCKET AUTH */
setupSocketAuth(io);

/* SOCKET EVENTS */
initSocketManager(io);

/* ================= START SERVER ================= */
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
