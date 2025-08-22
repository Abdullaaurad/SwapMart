const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-likes', authenticateToken, likeController.getLikes);
router.post('/create', authenticateToken, likeController.addLikes);
router.delete('/:id', authenticateToken, likeController.removeLikes);

module.exports = router;