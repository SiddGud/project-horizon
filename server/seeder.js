// ══════════════════════════════════════════
//  DATABASE SEEDER — Seed sample data
//  Run: node seeder.js
//  Clear: node seeder.js --clear
// ══════════════════════════════════════════
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User        = require('./models/User');
const Course      = require('./models/Course');
const { Quiz }    = require('./models/Quiz');
const Certificate = require('./models/Certificate');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project_horizon';

const SEED_COURSES = [
  {
    title: 'React.js Mastery', category: 'web', level: 'Intermediate',
    description: 'Master React from Hooks to Advanced Patterns and build real-world apps.',
    shortDesc: 'Complete React.js course from beginner to advanced.',
    icon: '⚛️', totalHours: 42, isPublished: true, isFree: true,
    tags: ['react', 'javascript', 'frontend', 'hooks'],
    modules: [
      { title: 'Introduction to React', order: 1, duration: 45 },
      { title: 'Components & JSX', order: 2, duration: 60 },
      { title: 'State & Props', order: 3, duration: 75 },
      { title: 'React Hooks (useState, useEffect)', order: 4, duration: 90 },
      { title: 'Context API', order: 5, duration: 60 },
      { title: 'React Router v6', order: 6, duration: 70 },
      { title: 'Advanced Hooks', order: 7, duration: 80 },
      { title: 'Performance Optimization', order: 8, duration: 65 },
      { title: 'Testing with React Testing Library', order: 9, duration: 75 },
      { title: 'Deployment & CI/CD', order: 10, duration: 50 },
    ],
  },
  {
    title: 'Python for AI & ML', category: 'ai', level: 'Beginner',
    description: 'Complete Python for Data Science, AI and Machine Learning with hands-on projects.',
    shortDesc: 'Python fundamentals to ML algorithms.',
    icon: '🐍', totalHours: 55, isPublished: true, isFree: true,
    tags: ['python', 'machine-learning', 'data-science', 'ai'],
    modules: [
      { title: 'Python Basics', order: 1, duration: 60 },
      { title: 'Data Structures', order: 2, duration: 75 },
      { title: 'NumPy & Pandas', order: 3, duration: 90 },
      { title: 'Data Visualization', order: 4, duration: 70 },
      { title: 'Machine Learning with Scikit-Learn', order: 5, duration: 120 },
      { title: 'Deep Learning with TensorFlow', order: 6, duration: 150 },
      { title: 'Natural Language Processing', order: 7, duration: 100 },
      { title: 'Computer Vision', order: 8, duration: 110 },
      { title: 'Model Deployment', order: 9, duration: 80 },
      { title: 'Capstone Project', order: 10, duration: 120 },
    ],
  },
  {
    title: 'Node.js & Express', category: 'web', level: 'Intermediate',
    description: 'Build scalable REST APIs and web applications with Node.js and Express.js.',
    icon: '🟩', totalHours: 38, isPublished: true, isFree: true,
    tags: ['nodejs', 'express', 'backend', 'api', 'javascript'],
    modules: [
      { title: 'Node.js Fundamentals', order: 1, duration: 60 },
      { title: 'Express.js Setup', order: 2, duration: 50 },
      { title: 'REST API Design', order: 3, duration: 80 },
      { title: 'Middleware & Error Handling', order: 4, duration: 70 },
      { title: 'Authentication with JWT', order: 5, duration: 90 },
      { title: 'File Uploads with Multer', order: 6, duration: 65 },
      { title: 'Testing APIs', order: 7, duration: 75 },
      { title: 'Deployment to Heroku/Render', order: 8, duration: 60 },
    ],
  },
  {
    title: 'MongoDB Essentials', category: 'data', level: 'Beginner',
    description: 'Master NoSQL databases with MongoDB Atlas, queries, and aggregation.',
    icon: '🍃', totalHours: 22, isPublished: true, isFree: true,
    tags: ['mongodb', 'nosql', 'database', 'atlas'],
    modules: [
      { title: 'What is MongoDB?', order: 1, duration: 40 },
      { title: 'CRUD Operations', order: 2, duration: 60 },
      { title: 'Querying & Indexing', order: 3, duration: 70 },
      { title: 'Aggregation Pipeline', order: 4, duration: 80 },
      { title: 'Mongoose ORM', order: 5, duration: 90 },
      { title: 'MongoDB Atlas & Cloud', order: 6, duration: 60 },
      { title: 'Security & Best Practices', order: 7, duration: 50 },
      { title: 'Project: Build a Blog API', order: 8, duration: 120 },
    ],
  },
  {
    title: 'UI/UX Design Pro', category: 'design', level: 'Beginner',
    description: 'Design stunning interfaces using Figma, Sketch and modern design principles.',
    icon: '🎨', totalHours: 30, isPublished: true, isFree: true,
    tags: ['ux', 'ui', 'figma', 'design', 'prototyping'],
    modules: [
      { title: 'Design Principles', order: 1, duration: 60 },
      { title: 'Color Theory & Typography', order: 2, duration: 70 },
      { title: 'Figma Basics', order: 3, duration: 80 },
      { title: 'Wireframing', order: 4, duration: 65 },
      { title: 'Prototyping & Interactions', order: 5, duration: 90 },
      { title: 'Design Systems', order: 6, duration: 75 },
      { title: 'User Research & Testing', order: 7, duration: 60 },
      { title: 'Portfolio Project', order: 8, duration: 100 },
    ],
  },
];

const SEED_QUIZ = {
  title: 'React.js Fundamentals',
  category: 'web',
  difficulty: 'Intermediate',
  timeLimit: 15,
  passMark: 60,
  isPublished: true,
  questions: [
    { question: 'What hook manages state in React functional components?', options: ['useEffect', 'useState', 'useContext', 'useRef'], answer: 1, explanation: 'useState returns a stateful value and a function to update it.' },
    { question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'None of these'], answer: 0, explanation: 'JSX stands for JavaScript XML, a syntax extension for React.' },
    { question: 'Which hook replaces componentDidMount and componentDidUpdate?', options: ['useState', 'useCallback', 'useEffect', 'useMemo'], answer: 2, explanation: 'useEffect runs after every render by default.' },
    { question: 'What is the Virtual DOM?', options: ['A direct copy of the real DOM', 'A lightweight JS object tree', 'A CSS framework', 'A state manager'], answer: 1, explanation: 'The Virtual DOM is a lightweight representation of the real DOM.' },
    { question: 'How do you pass data from parent to child in React?', options: ['State', 'Props', 'Context', 'Ref'], answer: 1, explanation: 'Props (properties) are the primary way to pass data to child components.' },
    { question: 'What is the purpose of the key prop in lists?', options: ['Styling', 'Performance optimization', 'Animation', 'Data binding'], answer: 1, explanation: 'Keys help React identify which items have changed, are added, or removed.' },
    { question: 'Which company created React.js?', options: ['Google', 'Microsoft', 'Facebook/Meta', 'Netflix'], answer: 2, explanation: 'React was created by Jordan Walke at Facebook (now Meta) in 2013.' },
    { question: 'What does React.Fragment do?', options: ['Styles components', 'Wraps elements without extra DOM nodes', 'Lazy loads components', 'Creates error boundaries'], answer: 1, explanation: 'Fragment lets you group children without adding extra DOM nodes.' },
    { question: 'Which hook memoizes a function?', options: ['useMemo', 'useCallback', 'useRef', 'useState'], answer: 1, explanation: 'useCallback memoizes a function, while useMemo memoizes a value.' },
    { question: 'What is the correct way to update state in React?', options: ['Directly modify state', 'Use setState / setter function', 'Use global variable', 'Use document.write'], answer: 1, explanation: 'State must be updated using the setter function from useState or setState in class components.' },
  ],
};

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv[2] === '--clear') {
      await Promise.all([
        User.deleteMany({}),
        Course.deleteMany({}),
        Quiz.deleteMany({}),
        Certificate.deleteMany({}),
      ]);
      console.log('🗑️  Database cleared.');
      process.exit(0);
    }

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@horizon.com' });
    let admin;
    if (!adminExists) {
      admin = await User.create({
        name: 'Admin User', email: 'admin@horizon.com',
        password: 'admin123', role: 'admin',
      });
      console.log('👤 Admin created: admin@horizon.com / admin123');
    } else {
      admin = adminExists;
      console.log('👤 Admin already exists.');
    }

    // Create instructor
    const instrExists = await User.findOne({ email: 'instructor@horizon.com' });
    let instructor;
    if (!instrExists) {
      instructor = await User.create({
        name: 'Ravi Verma', email: 'instructor@horizon.com',
        password: 'instr123', role: 'instructor',
      });
      console.log('👨‍🏫 Instructor created: instructor@horizon.com / instr123');
    } else {
      instructor = instrExists;
    }

    // Create student
    const studExists = await User.findOne({ email: 'student@horizon.com' });
    if (!studExists) {
      await User.create({
        name: 'Aryan Sharma', email: 'student@horizon.com',
        password: 'student123', role: 'student', xp: 890, streak: 14,
      });
      console.log('🎓 Student created: student@horizon.com / student123');
    }

    // Seed courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const courses = await Course.insertMany(
        SEED_COURSES.map(c => ({ ...c, instructor: instructor._id, instructorName: instructor.name }))
      );
      console.log(`📚 ${courses.length} courses seeded.`);

      // Seed quiz linked to first course
      await Quiz.create({ ...SEED_QUIZ, course: courses[0]._id });
      console.log('📝 Quiz seeded.');
    } else {
      console.log(`📚 Courses already seeded (${courseCount}).`);
    }

    console.log('');
    console.log('✅ Seeding complete!');
    console.log('────────────────────────────────────────');
    console.log('🔑 Login credentials:');
    console.log('   Admin:      admin@horizon.com / admin123');
    console.log('   Instructor: instructor@horizon.com / instr123');
    console.log('   Student:    student@horizon.com / student123');
    console.log('────────────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seedData();
