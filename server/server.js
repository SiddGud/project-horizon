// ══════════════════════════════════════════
//  PROJECT HORIZON — Main Server
//  Ansh Soft Tech
// ══════════════════════════════════════════
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config();

const app = express();

// ─── Middleware ───
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', '*'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── MongoDB Connection ───
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected:', process.env.MONGO_URI))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Make sure MongoDB is running locally or update MONGO_URI in .env');
    process.exit(1);
  });

// ─── Routes ───
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/courses',      require('./routes/courses'));
app.use('/api/quiz',         require('./routes/quiz'));
app.use('/api/progress',     require('./routes/progress'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/ai',           require('./routes/ai'));
app.use('/api/notifications',require('./routes/notifications'));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    platform: 'Project Horizon',
    company: 'Ansh Soft Tech',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// ─── Serve Frontend ───
app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ─── Global Error Handler ───
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ══════════════════════════════════════════');
  console.log('   PROJECT HORIZON BACKEND — Ansh Soft Tech  ');
  console.log('══════════════════════════════════════════════');
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`📡 API Base URL:      http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check:     http://localhost:${PORT}/api/health`);
  console.log('══════════════════════════════════════════════');
  console.log('');
});

module.exports = app;
