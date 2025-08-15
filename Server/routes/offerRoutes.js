// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');

router.post('/my-offers', authenticateToken, offerController.getOffer);

module.exports = router;