// ─── Courses Routes ───
const express  = require('express');
const router   = express.Router();
const Course   = require('../models/Course');
const User     = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ─── GET /api/courses ─── (public - get all published courses)
router.get('/', async (req, res) => {
  try {
    const { category, level, search, sort } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'all') filter.category = category;
    if (level)    filter.level    = level;
    if (search)   filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } },
    ];

    let query = Course.find(filter).populate('instructor', 'name avatar');

    if (sort === 'rating')   query = query.sort({ avgRating: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else if (sort === 'popular')query = query.sort({ totalStudents: -1 });

    const courses = await query;
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/courses/:id ─── (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/courses ─── (instructor/admin only)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructorName: req.user.name,
    });
    res.status(201).json({ success: true, message: 'Course created successfully!', course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/courses/:id ─── (instructor/admin)
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course updated!', course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/courses/:id ─── (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/courses/:id/enroll ─── (student, protected)
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.find(
      ec => ec.course?.toString() === req.params.id
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
    }

    user.enrolledCourses.push({ course: course._id, progress: 0 });
    user.xp += 50;
    await user.save();

    course.totalStudents += 1;
    await course.save();

    res.json({ success: true, message: `Successfully enrolled in "${course.title}"! +50 XP` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/courses/:id/rate ─── (student, protected)
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    const existingIdx = course.ratings.findIndex(r => r.user?.toString() === req.user._id.toString());
    if (existingIdx > -1) {
      course.ratings[existingIdx] = { user: req.user._id, rating, review };
    } else {
      course.ratings.push({ user: req.user._id, rating, review });
    }
    await course.save();
    res.json({ success: true, message: 'Rating submitted! Thank you.', avgRating: course.avgRating });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
