const { Router } = require('express');
const syncUserToDb = require('../webhooks/clerk');
const verifyUser = require('../middleware/auth'); 

const clerkRouter = Router();

clerkRouter.get("/sync", verifyUser, syncUserToDb);

module.exports = clerkRouter;