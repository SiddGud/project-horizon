// ─── Course Model ───
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  videoUrl:    { type: String, default: '' },
  duration:    { type: Number, default: 0 }, // minutes
  resources:   [{ name: String, url: String, type: String }],
  order:       { type: Number, required: true },
});

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: [true, 'Course title is required'], trim: true },
  description: { type: String, required: true },
  shortDesc:   { type: String, maxlength: 200 },
  category:    {
    type: String,
    enum: ['web', 'ai', 'data', 'design', 'mobile', 'other'],
    required: true,
  },
  level:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  thumbnail:   { type: String, default: '' },
  icon:        { type: String, default: '📚' },

  instructor: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  instructorName: { type: String },

  modules: [moduleSchema],

  price:       { type: Number, default: 0 },
  isFree:      { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },

  tags:        [String],
  totalHours:  { type: Number, default: 0 },
  totalModules:{ type: Number, default: 0 },

  ratings: [{
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating:  { type: Number, min: 1, max: 5 },
    review:  String,
    date:    { type: Date, default: Date.now },
  }],
  avgRating:    { type: Number, default: 0 },
  totalStudents:{ type: Number, default: 0 },

}, { timestamps: true });

// Auto-update totalModules
courseSchema.pre('save', function (next) {
  this.totalModules = this.modules.length;
  this.totalHours   = Math.round(this.modules.reduce((t, m) => t + (m.duration || 0), 0) / 60);
  if (this.ratings.length > 0) {
    this.avgRating = this.ratings.reduce((s, r) => s + r.rating, 0) / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
