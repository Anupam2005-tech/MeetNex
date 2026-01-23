const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const dotenv = require("dotenv");
dotenv.config();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const configureMiddleware = (app) => {
  if (!app || typeof app.use !== 'function') {
    throw new Error('Invalid app object passed to configureMiddleware');
  }
  app.use(cors(corsOption));
  app.use(express.json());
  app.use(clerkMiddleware());
};

module.exports = configureMiddleware;