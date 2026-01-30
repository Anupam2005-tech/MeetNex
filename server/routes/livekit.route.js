const express = require('express');
const { createToken } = require('../controllers/livekit.controller.js');

const router = express.Router();

router.post('/token', createToken);

module.exports = router;
