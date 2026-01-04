const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const configureMiddleware = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware());
};

module.exports = configureMiddleware;