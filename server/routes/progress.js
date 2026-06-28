// ─── Progress Routes ───
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── GET /api/progress/me ─── Get user's full learning progress
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title icon category totalModules')
      .populate('certificates');

    const progressData = {
      totalEnrolled:  user.enrolledCourses.length,
      totalCompleted: user.enrolledCourses.filter(ec => ec.progress >= 100).length,
      totalCerts:     user.certificates.length,
      xp:             user.xp,
      streak:         user.streak,
      badges:         user.badges,
      courses: user.enrolledCourses.map(ec => ({
        courseId:      ec.course?._id,
        title:         ec.course?.title,
        icon:          ec.course?.icon,
        category:      ec.course?.category,
        progress:      ec.progress,
        currentModule: ec.currentModule,
        totalModules:  ec.course?.totalModules,
        enrolledAt:    ec.enrolledAt,
        completedAt:   ec.completedAt,
      })),
    };

    res.json({ success: true, progress: progressData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/progress/:courseId ─── Update course progress
router.put('/:courseId', protect, async (req, res) => {
  try {
    const { progress, currentModule } = req.body;
    const user = await User.findById(req.user._id);

    const enrollmentIdx = user.enrolledCourses.findIndex(
      ec => ec.course?.toString() === req.params.courseId
    );
    if (enrollmentIdx === -1) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course.' });
    }

    const enrollment = user.enrolledCourses[enrollmentIdx];
    if (progress !== undefined) enrollment.progress = Math.min(100, progress);
    if (currentModule !== undefined) enrollment.currentModule = currentModule;
    if (enrollment.progress >= 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      user.xp += 200; // Bonus XP for completing a course
      user.badges.push({ name: 'Course Completer 🏆', earnedAt: new Date() });
    }

    await user.save();
    res.json({
      success: true,
      message: enrollment.progress >= 100 ? '🎉 Course completed! +200 XP' : 'Progress updated!',
      progress: enrollment.progress,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/progress/dashboard ─── Full dashboard analytics
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title icon category');

    const { Attempt } = require('../models/Quiz');
    const recentAttempts = await Attempt.find({ user: req.user._id })
      .populate('quiz', 'title')
      .sort({ completedAt: -1 })
      .limit(5);

    const avgQuizScore = recentAttempts.length
      ? Math.round(recentAttempts.reduce((a, b) => a + b.percentage, 0) / recentAttempts.length)
      : 0;

    res.json({
      success: true,
      dashboard: {
        user: {
          name:   user.name,
          email:  user.email,
          role:   user.role,
          xp:     user.xp,
          streak: user.streak,
          badges: user.badges,
        },
        stats: {
          totalEnrolled:  user.enrolledCourses.length,
          totalCompleted: user.enrolledCourses.filter(e => e.progress >= 100).length,
          totalCerts:     user.certificates.length,
          avgQuizScore,
        },
        enrolledCourses: user.enrolledCourses,
        recentAttempts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
