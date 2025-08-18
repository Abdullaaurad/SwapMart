// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-offers', authenticateToken, offerController.getOffer);
router.post('/create', authenticateToken, offerController.createOffer);4
router.put('/:id',authenticateToken, offerController.)

module.exports = router;