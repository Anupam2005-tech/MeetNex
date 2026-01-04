const {Router}=require('express');
const getUserAuth = require('../webhooks/clerk');

const clerkRouter = Router();
clerkRouter.get("/sync", getUserAuth);

module.exports = clerkRouter;