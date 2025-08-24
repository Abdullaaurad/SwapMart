const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.getByUser(user_id);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, details, type, icon } = req.body;
    const user_id = req.user.id;
    const notification = await Notification.create({ user_id, title, message, details, type, icon });
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating notification' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id);
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error marking as read' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting notification' });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Notification.clearAll(user_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error clearing notifications' });
  }
};