// ─── Notifications Routes ───
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ─── GET /api/notifications ─── Get user's notifications
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const sorted = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json({
      success: true,
      unreadCount: sorted.filter(n => !n.read).length,
      notifications: sorted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/notifications/read-all ─── Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/notifications/:id/read ─── Mark single notification as read
router.put('/:notifId/read', protect, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.notifId },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/notifications/broadcast ─── Admin broadcast to all users
router.post('/broadcast', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }
    const notif = { title, message, type: type || 'info', read: false, createdAt: new Date() };
    await User.updateMany({}, { $push: { notifications: { $each: [notif], $position: 0 } } });
    res.json({ success: true, message: `Announcement sent to all users!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
