// ─── Auth Routes ───
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: sign JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ─── POST /api/auth/register ───
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'instructor' ? 'instructor' : 'student',
      notifications: [{
        title: 'Welcome to Project Horizon! 🎉',
        message: 'Start your learning journey by enrolling in a course.',
        type: 'success',
      }],
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: `Welcome to Project Horizon, ${user.name}!`,
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        xp:    user.xp,
        streak:user.streak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/auth/login ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update streak
    const now         = new Date();
    const lastLogin   = new Date(user.lastLogin);
    const diffDays    = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.streak += 1;
    else if (diffDays > 1) user.streak = 1;
    user.lastLogin = now;
    await user.save();

    const token = signToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        role:            user.role,
        xp:              user.xp,
        streak:          user.streak,
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/auth/me ─── (protected)
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses.course', 'title icon category')
    .populate('certificates');

  res.json({ success: true, user });
});

// ─── PUT /api/auth/profile ─── (protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/auth/change-password ─── (protected)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
