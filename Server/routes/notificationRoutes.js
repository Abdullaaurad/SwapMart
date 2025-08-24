const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, notificationController.getNotifications);
router.post('/', authenticateToken, notificationController.createNotification);
router.post('/:id/read', authenticateToken, notificationController.markAsRead);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);
router.delete('/clear/all', authenticateToken, notificationController.clearAllNotifications);

module.exports = router;