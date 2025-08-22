const express = require('express');
const router = express.Router();
const recentController = require('../controllers/recentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-views', authenticateToken, recentController.getRecent);
router.post('/create', authenticateToken, recentController.addRecentView);
router.delete('/all', authenticateToken, recentController.clearAllRecents);

module.exports = router;