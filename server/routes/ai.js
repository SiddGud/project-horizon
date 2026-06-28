// ─── AI Chatbot Routes (Gemini API) ───
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');

// ─── POST /api/ai/chat ─── AI Chatbot
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    // Try Gemini API if key exists
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model  = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemContext = `You are Horizon AI, the intelligent learning assistant for Project Horizon — a Learning & Skill Development Platform built by Ansh Soft Tech. 
You help students with:
- Course recommendations (React.js, Python, AI/ML, UI/UX Design, Node.js, MongoDB, Data Science, Flutter)
- Learning tips and study strategies
- Explaining programming concepts clearly
- Tracking and motivation for learning progress
- Platform navigation

Keep responses helpful, encouraging, and concise (2-4 sentences max). Use emojis occasionally.`;

        const chat = model.startChat({
          history: [{ role: 'user', parts: [{ text: systemContext }] }, { role: 'model', parts: [{ text: 'I understand. I am Horizon AI, ready to help students on Project Horizon!' }] }],
        });

        const result   = await chat.sendMessage(message);
        const response = result.response.text();

        return res.json({ success: true, reply: response, source: 'gemini' });
      } catch (geminiErr) {
        console.error('Gemini API Error:', geminiErr.message);
        // Fall through to fallback
      }
    }

    // Fallback smart responses
    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('react') || msg.includes('frontend')) {
      reply = "React.js is one of our most popular courses! I'd recommend starting with React.js Mastery — it covers Hooks, Context API, and advanced patterns. You're already 72% through it — keep going!";
    } else if (msg.includes('python') || msg.includes('ai') || msg.includes('ml') || msg.includes('machine learning')) {
      reply = "For AI/ML, our Python for AI & ML course is perfect. Start with Python fundamentals, then move to Machine Learning A-Z and Deep Learning & NLP. These are the most in-demand skills right now!";
    } else if (msg.includes('certificate') || msg.includes('cert')) {
      reply = "Certificates are issued automatically when you pass a quiz with 60%+ score or complete a course. You can download them as PDF from the Certificates section. They include a unique verification code!";
    } else if (msg.includes('quiz') || msg.includes('test') || msg.includes('assessment')) {
      reply = "Our adaptive quiz engine tests your knowledge with 10 timed questions. Score 60%+ to pass and earn a certificate! Head to the Assessments section to try one now.";
    } else if (msg.includes('progress') || msg.includes('dashboard')) {
      reply = "Check your Dashboard -> Analytics section for detailed performance insights — skill proficiency, weekly study hours, streak, and achievements. You're doing great!";
    } else if (msg.includes('mongodb') || msg.includes('database') || msg.includes('db')) {
      reply = "MongoDB is perfect for modern web apps! Our MongoDB Essentials course covers collections, queries, aggregation pipelines, and MongoDB Atlas. It pairs perfectly with Node.js and Express!";
    } else if (msg.includes('node') || msg.includes('backend') || msg.includes('server')) {
      reply = "For backend development, Node.js & Express is the way to go! Combined with MongoDB and JWT auth, you'll be able to build complete full-stack apps. Check it out in our course catalog!";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      reply = `Hello! I'm Horizon AI, your learning assistant on Project Horizon by Ansh Soft Tech. I can help you choose courses, explain concepts, or track your progress. What would you like to learn today?`;
    } else if (msg.includes('help') || msg.includes('what can you do')) {
      reply = "I can help you with:\n• Course recommendations based on your goals\n• Explaining concepts from any enrolled course\n• Study tips and learning strategies\n• Platform navigation and features\n\nWhat do you need help with?";
    } else if (msg.includes('streak') || msg.includes('xp') || msg.includes('badge')) {
      reply = "Your learning streak keeps you motivated! Login daily to maintain your streak and earn XP. Badges are awarded for milestones — like completing your first course or scoring 100% on a quiz!";
    } else {
      reply = "That's a great question! As Horizon AI, I specialize in helping you navigate Project Horizon's courses, quizzes, and learning paths. Could you be more specific? For example, ask me about a course, a programming concept, or your progress!";
    }

    res.json({ success: true, reply, source: 'fallback' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/ai/recommend ─── Course recommendations
router.post('/recommend', protect, async (req, res) => {
  try {
    const { interests, level } = req.body;
    const Course = require('../models/Course');

    const filter = { isPublished: true };
    if (level)     filter.level    = level;
    if (interests) filter.category = { $in: interests };

    const courses = await Course.find(filter)
      .sort({ avgRating: -1, totalStudents: -1 })
      .limit(4)
      .select('title icon category level avgRating totalStudents description');

    res.json({ success: true, recommendations: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
