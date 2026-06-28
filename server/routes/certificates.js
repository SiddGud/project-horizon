// ─── Certificates Routes ───
const express     = require('express');
const router      = express.Router();
const Certificate = require('../models/Certificate');
const { protect, authorize } = require('../middleware/auth');

// ─── GET /api/certificates/me ─── Get user's certificates
router.get('/me', protect, async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user._id })
      .populate('course', 'title icon category')
      .sort({ issuedAt: -1 });
    res.json({ success: true, count: certs.length, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/certificates/verify/:certId ─── Public verification
router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId })
      .populate('user', 'name email')
      .populate('course', 'title icon');
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found or invalid.' });
    }
    res.json({
      success: true,
      valid:   true,
      certificate: {
        certId:      cert.certId,
        userName:    cert.userName,
        courseTitle: cert.courseTitle,
        instructor:  cert.instructor,
        issuedAt:    cert.issuedAt,
        issuedBy:    'Ansh Soft Tech — Project Horizon',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/certificates/issue ─── Issue certificate manually (admin)
router.post('/issue', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { userId, courseId, courseTitle, userName, instructor } = req.body;
    const cert = await Certificate.create({
      user:        userId || req.user._id,
      course:      courseId,
      courseTitle,
      userName:    userName || req.user.name,
      instructor,
    });
    res.status(201).json({ success: true, message: 'Certificate issued!', certificate: cert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/certificates/:id ─── Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Certificate deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
