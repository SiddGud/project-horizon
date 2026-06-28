// ─── User Model ───
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
    trim: true, minlength: 2, maxlength: 60,
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type: String, required: [true, 'Password is required'],
    minlength: 6, select: false,
  },
  role: {
    type: String, enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  avatar: { type: String, default: '' },
  bio:    { type: String, default: '', maxlength: 300 },

  // Learning data
  enrolledCourses: [{
    course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    progress:   { type: Number, default: 0 },        // 0–100
    currentModule: { type: Number, default: 1 },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: Date,
  }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],

  // Gamification
  xp:        { type: Number, default: 0 },
  streak:    { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  badges:    [{ name: String, earnedAt: Date }],

  // Notifications
  notifications: [{
    title:    String,
    message:  String,
    type:     { type: String, enum: ['info','success','warning','live','new'] },
    read:     { type: Boolean, default: false },
    createdAt:{ type: Date, default: Date.now },
  }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
