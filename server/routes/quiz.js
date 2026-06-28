// ─── Quiz Routes ───
const express  = require('express');
const router   = express.Router();
const { Quiz, Attempt } = require('../models/Quiz');
const Certificate = require('../models/Certificate');
const User     = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ─── GET /api/quiz ─── (public - all published quizzes)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select('-questions.answer') // Hide answers from list view
      .populate('course', 'title icon');
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/quiz/:id ─── (public - get quiz without answers)
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.answer');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/quiz ─── (instructor/admin)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, message: 'Quiz created!', quiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── POST /api/quiz/:id/submit ─── (student, protected)
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    // Grade the quiz
    let score = 0;
    const results = quiz.questions.map((q, i) => {
      const correct = answers[i] === q.answer;
      if (correct) score++;
      return {
        question:     q.question,
        yourAnswer:   q.options[answers[i]] || 'Not answered',
        correctAnswer:q.options[q.answer],
        correct,
        explanation:  q.explanation || '',
      };
    });

    const attempt = await Attempt.create({
      user:      req.user._id,
      quiz:      quiz._id,
      answers,
      score,
      total:     quiz.questions.length,
      timeTaken: timeTaken || 0,
    });

    const user = await User.findById(req.user._id);

    // XP reward
    const xpEarned = score * 10;
    user.xp += xpEarned;

    // Auto-issue certificate if passed
    let certificate = null;
    if (attempt.passed) {
      const exists = await Certificate.findOne({ user: user._id, courseTitle: quiz.title });
      if (!exists) {
        certificate = await Certificate.create({
          user:        user._id,
          courseTitle: quiz.title,
          userName:    user.name,
        });
        user.certificates.push(certificate._id);
      }
    }
    await user.save();

    res.json({
      success:     true,
      message:     attempt.passed ? `🎉 Passed! Score: ${score}/${quiz.questions.length}` : `📚 Score: ${score}/${quiz.questions.length}. Keep practicing!`,
      score,
      total:       quiz.questions.length,
      percentage:  attempt.percentage,
      passed:      attempt.passed,
      xpEarned,
      results,
      certificate: certificate ? certificate.certId : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/quiz/attempts/me ─── (protected - user's attempts)
router.get('/attempts/me', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 });
    res.json({ success: true, attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
