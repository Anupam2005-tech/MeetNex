const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const DbConnection = require("./config/db");
const clerkRoutes = require("./routes/userAuthRoutes");
const MeetingRoutes = require("./routes/meetingRoutes");
const configureMiddleware = require("./middleware/auth");

const { setupSocketAuth } = require("./middleware/socketAuth");
const { initSocketManager } = require("./socket/socketManager");

const PORT = process.env.PORT || 5000;

const app = express();

/* ================= MIDDLEWARE ================= */
configureMiddleware(app);

/* ================= DATABASE ================= */
DbConnection();

/* ================= ROUTES ================= */
app.use("/user", clerkRoutes);
app.use("/meeting", MeetingRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/* ================= HTTP + SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* SOCKET AUTH */
setupSocketAuth(io);

/*  SOCKET EVENTS */
initSocketManager(io);

/* ================= START SERVER ================= */
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
