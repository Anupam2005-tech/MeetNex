const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

function configureMiddleware(app) {
  app.use(express.json());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(clerkMiddleware());
}

module.exports = configureMiddleware;
