// ─── Certificate Model ───
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseTitle:{ type: String, required: true },
  userName:   { type: String, required: true },
  instructor: { type: String, default: '' },
  certId:     { type: String, unique: true },
  issuedAt:   { type: Date, default: Date.now },
  pdfUrl:     { type: String, default: '' },
}, { timestamps: true });

// Auto-generate certificate ID
certificateSchema.pre('save', function (next) {
  if (!this.certId) {
    const year  = new Date().getFullYear();
    const rand  = Math.random().toString(36).toUpperCase().substr(2, 6);
    this.certId = `CERT-${year}-AST-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
