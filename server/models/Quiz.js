// ─── Quiz Model ───
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String, required: true }],
  answer:   { type: Number, required: true }, // index of correct option
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  category:   { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  timeLimit:  { type: Number, default: 15 }, // minutes
  questions:  [questionSchema],
  passMark:   { type: Number, default: 60 }, // percentage
  isPublished:{ type: Boolean, default: true },
}, { timestamps: true });

// ─── Quiz Attempt Model ───
const attemptSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:       { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers:    [{ type: Number }],          // user's selected option indices
  score:      { type: Number, required: true },
  total:      { type: Number, required: true },
  percentage: { type: Number },
  passed:     { type: Boolean, default: false },
  timeTaken:  { type: Number },            // seconds
  completedAt:{ type: Date, default: Date.now },
}, { timestamps: true });

attemptSchema.pre('save', function (next) {
  this.percentage = Math.round((this.score / this.total) * 100);
  this.passed     = this.percentage >= 60;
  next();
});

const Quiz    = mongoose.model('Quiz',    quizSchema);
const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = { Quiz, Attempt };
