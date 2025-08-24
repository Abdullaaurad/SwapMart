const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:id', authenticateToken, swapController.getSwapById);
router.get('/user/all', authenticateToken, swapController.getSwapsForUser);
router.get('/product/:productId', authenticateToken, swapController.getSwapsForProduct);
router.post('/create', authenticateToken, swapController.createSwap);
router.post('/:id/complete', authenticateToken, swapController.markSwapCompleted);

module.exports = router;