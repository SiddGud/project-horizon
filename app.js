// ══════════════════════════════════════════════════
//   PROJECT HORIZON — app.js
//   Ansh Soft Tech
// ══════════════════════════════════════════════════

// ─── Backend API Configuration ───
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('horizon_token') || null;
let currentUser = JSON.parse(localStorage.getItem('horizon_user') || 'null');

// Helper: API call with auth
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

// Check backend health on load
function checkBackend() {
  fetch(`${API_BASE}/health`)
    .then(r => r.json())
    .then(d => {
      if (d.status === 'OK') {
        console.log('%c✅ Backend Connected: ' + d.platform, 'color:#4ECB71;font-weight:bold');
        console.log('%cMongoDB: ' + d.mongodb, 'color:#00D4FF');
        // Load real courses if backend is up
        loadCoursesFromAPI();
        if (authToken) loadUserFromAPI();
      }
    })
    .catch(() => console.log('%c⚠️ Backend offline – running in demo mode', 'color:#FFB347'));
}

async function loadCoursesFromAPI() {
  try {
    const data = await apiCall('/courses');
    if (data.courses && data.courses.length > 0) {
      window.API_COURSES = data.courses;
    }
  } catch(e) { /* use local data */ }
}

async function loadUserFromAPI() {
  try {
    const data = await apiCall('/auth/me');
    currentUser = data.user;
    localStorage.setItem('horizon_user', JSON.stringify(currentUser));
  } catch(e) {
    authToken = null; currentUser = null;
    localStorage.removeItem('horizon_token');
    localStorage.removeItem('horizon_user');
  }
}

/* ─── Data ─── */
const COURSES = [
  { id:1, title:'React.js Mastery', category:'web', lucide:'code-2', color:'#6366F1', bg:'linear-gradient(135deg,#0D1020,#1A1040)', instructor:'Ravi Verma', rating:4.9, students:2340, hours:42, level:'Intermediate', desc:'Master React from Hooks to advanced patterns and build real-world apps.' },
  { id:2, title:'Python for AI & ML', category:'ai', lucide:'cpu', color:'#06B6D4', bg:'linear-gradient(135deg,#081820,#0A2430)', instructor:'Dr. Priya Nair', rating:4.8, students:3100, hours:55, level:'Beginner', desc:'Complete Python for Data Science and Machine Learning from scratch.' },
  { id:3, title:'UI/UX Design Pro', category:'design', lucide:'palette', color:'#EC4899', bg:'linear-gradient(135deg,#200A18,#300820)', instructor:'Sneha Kapoor', rating:4.7, students:1890, hours:30, level:'Beginner', desc:'Design stunning interfaces using Figma, Sketch and modern principles.' },
  { id:4, title:'Node.js & Express', category:'web', lucide:'server', color:'#10B981', bg:'linear-gradient(135deg,#081808,#0A2010)', instructor:'Arjun Singh', rating:4.8, students:2050, hours:38, level:'Intermediate', desc:'Build scalable REST APIs and backend services with Node.js.' },
  { id:5, title:'MongoDB Essentials', category:'data', lucide:'database', color:'#10B981', bg:'linear-gradient(135deg,#081508,#0A1A08)', instructor:'Kavya Reddy', rating:4.6, students:1230, hours:22, level:'Beginner', desc:'Master NoSQL databases with MongoDB Atlas, queries and aggregation.' },
  { id:6, title:'Data Science with Python', category:'data', lucide:'bar-chart-2', color:'#06B6D4', bg:'linear-gradient(135deg,#081828,#0A2040)', instructor:'Dr. Amit Patel', rating:4.9, students:4200, hours:65, level:'Advanced', desc:'Complete Data Science pipeline from EDA to model deployment.' },
  { id:7, title:'Flutter Mobile Dev', category:'mobile', lucide:'smartphone', color:'#8B5CF6', bg:'linear-gradient(135deg,#120A28,#1A1040)', instructor:'Rohit Mehta', rating:4.7, students:1680, hours:48, level:'Intermediate', desc:'Build cross-platform iOS and Android apps with Flutter and Dart.' },
  { id:8, title:'Machine Learning A-Z', category:'ai', lucide:'brain', color:'#6366F1', bg:'linear-gradient(135deg,#0D1020,#150820)', instructor:'Dr. Priya Nair', rating:4.9, students:5600, hours:70, level:'Advanced', desc:'Supervised, Unsupervised, and Reinforcement Learning in depth.' },
  { id:9, title:'JavaScript Advanced', category:'web', lucide:'braces', color:'#F59E0B', bg:'linear-gradient(135deg,#1A1400,#201800)', instructor:'Arjun Singh', rating:4.8, students:3200, hours:40, level:'Advanced', desc:'Closures, Prototypes, Async/Await, and modern Design Patterns.' },
  { id:10, title:'Figma UI Design', category:'design', lucide:'pen-tool', color:'#A78BFA', bg:'linear-gradient(135deg,#120A28,#1A1040)', instructor:'Sneha Kapoor', rating:4.7, students:2100, hours:28, level:'Beginner', desc:'Create professional UI designs and interactive prototypes in Figma.' },
  { id:11, title:'React Native Apps', category:'mobile', lucide:'tablet-smartphone', color:'#06B6D4', bg:'linear-gradient(135deg,#081528,#0A1840)', instructor:'Ravi Verma', rating:4.6, students:1400, hours:50, level:'Intermediate', desc:'Build native iOS and Android apps using React Native.' },
  { id:12, title:'Deep Learning & NLP', category:'ai', lucide:'network', color:'#F43F5E', bg:'linear-gradient(135deg,#200A10,#2A0818)', instructor:'Dr. Amit Patel', rating:4.9, students:2890, hours:80, level:'Advanced', desc:'Transformers, BERT, GPT and advanced NLP techniques.' },
];

const MY_COURSES = [
  { id:1, title:'React.js Mastery', lucide:'code-2', color:'#6366F1', progress:72, module:'8', total:'12' },
  { id:2, title:'Python for AI', lucide:'cpu', color:'#06B6D4', progress:45, module:'5', total:'10' },
  { id:3, title:'UI/UX Design', lucide:'palette', color:'#EC4899', progress:100, module:'8', total:'8' },
  { id:4, title:'MongoDB Essentials', lucide:'database', color:'#10B981', progress:20, module:'2', total:'8' },
];

const CERTIFICATES = [
  { title:'UI/UX Design Pro', lucide:'palette', date:'June 10, 2025', id:'CERT-2025-UIUX-001', color:'#EC4899', bg:'linear-gradient(135deg,#200A18,#300820)', instructor:'Sneha Kapoor' },
  { title:'JavaScript Basics', lucide:'braces', date:'April 22, 2025', id:'CERT-2025-JS-002', color:'#F59E0B', bg:'linear-gradient(135deg,#1A1400,#201800)', instructor:'Arjun Singh' },
  { title:'HTML & CSS Masterclass', lucide:'globe', date:'Feb 14, 2025', id:'CERT-2025-HTML-003', color:'#F43F5E', bg:'linear-gradient(135deg,#200808,#2A0A0A)', instructor:'Ravi Verma' },
];


const QUIZZES = {
  react: {
    label: 'React.js Fundamentals',
    time: 15,
    questions: [
      { q:'What hook is used to manage state in a React functional component?', opts:['useEffect','useState','useContext','useRef'], ans:1 },
      { q:'What does JSX stand for?', opts:['JavaScript XML','Java Syntax Extension','JavaScript Extension','None of these'], ans:0 },
      { q:'Which method is called after a component renders in class components?', opts:['componentWillMount','componentDidMount','componentWillUnmount','render'], ans:1 },
      { q:'What is the Virtual DOM?', opts:['A direct copy of the real DOM','A lightweight JS object tree','A CSS framework','A state manager'], ans:1 },
      { q:'Which hook replaces componentDidMount and componentDidUpdate?', opts:['useState','useCallback','useEffect','useMemo'], ans:2 },
      { q:'How do you pass data from parent to child in React?', opts:['State','Props','Context','Ref'], ans:1 },
      { q:'What is the purpose of key prop in a list?', opts:['Styling','Performance optimization','Animation','Data binding'], ans:1 },
      { q:'Which company created React.js?', opts:['Google','Microsoft','Facebook/Meta','Netflix'], ans:2 },
      { q:'What is React.Fragment used for?', opts:['Styling components','Wrapping elements without extra DOM nodes','Lazy loading','Error boundaries'], ans:1 },
      { q:'Which hook memoizes a function?', opts:['useMemo','useCallback','useRef','useState'], ans:1 },
    ]
  },
  python: {
    label: 'Python Essentials',
    time: 12,
    questions: [
      { q:'What is the output of: print(type([]))  ?', opts:['<class list>','<class array>','list','array'], ans:0 },
      { q:'Which keyword defines a function in Python?', opts:['function','func','def','define'], ans:2 },
      { q:'What does len() return?', opts:['Last element','Length of an object','Memory address','Data type'], ans:1 },
      { q:'Which is an immutable data type in Python?', opts:['List','Dictionary','Set','Tuple'], ans:3 },
      { q:'What operator is used for floor division?', opts:['/','//','%','**'], ans:1 },
      { q:'Which method adds an element to the end of a list?', opts:['add()','insert()','append()','extend()'], ans:2 },
      { q:'How do you open a file in Python?', opts:['file.open()','open()','fopen()','File()'], ans:1 },
      { q:'What is a lambda function?', opts:['A module','An anonymous function','A class method','A decorator'], ans:1 },
      { q:'Which module is used for regular expressions?', opts:['re','regex','string','match'], ans:0 },
      { q:'What does "pass" do in Python?', opts:['Skips a loop','Raises an exception','Acts as a placeholder','Exits a function'], ans:2 },
    ]
  },
  js: {
    label: 'JavaScript Advanced',
    time: 20,
    questions: [
      { q:'What does "use strict" do in JavaScript?', opts:['Enables strict parsing','Disables errors','Makes code faster','None'], ans:0 },
      { q:'What is a closure?', opts:['A function that returns an object','A function with access to its outer scope','A type of loop','An ES6 feature'], ans:1 },
      { q:'What does the spread operator (...) do?', opts:['Deletes an array','Creates a copy/expands iterable','Creates a generator','Imports a module'], ans:1 },
      { q:'Which method creates a new array with filtered elements?', opts:['map()','reduce()','filter()','find()'], ans:2 },
      { q:'What is event bubbling?', opts:['An animation event','Child event propagating to parents','A promise error','A CSS effect'], ans:1 },
      { q:'What is a Promise in JavaScript?', opts:['A type of variable','An async operation result','A CSS animation','A storage method'], ans:1 },
      { q:'What does JSON.parse() do?', opts:['Converts JS to JSON','Converts JSON string to JS object','Validates JSON','Formats JSON'], ans:1 },
      { q:'What is the difference between == and ===?', opts:['No difference','=== checks type too','== is stricter','=== is slower'], ans:1 },
      { q:'What is a prototype in JavaScript?', opts:['A blueprint class','An object all JS objects inherit from','A function type','A module'], ans:1 },
      { q:'What does async/await replace?', opts:['Callbacks and Promises','Loops','Variables','Classes'], ans:0 },
    ]
  },
  ai: {
    label: 'AI & Machine Learning',
    time: 18,
    questions: [
      { q:'What type of learning uses labeled data?', opts:['Unsupervised','Reinforcement','Supervised','Semi-supervised'], ans:2 },
      { q:'What is overfitting?', opts:['Model too simple','Model memorizes training data','Model underfits','None'], ans:1 },
      { q:'Which algorithm is used for classification?', opts:['K-Means','Linear Regression','Logistic Regression','PCA'], ans:2 },
      { q:'What is a neural network?', opts:['A hardware device','A graph of computations','Layers of interconnected nodes','A database'], ans:2 },
      { q:'What does CNN stand for?', opts:['Convolutional Neural Network','Concurrent Node Network','Compiled Neural Net','None'], ans:0 },
      { q:'What is gradient descent?', opts:['A climbing algorithm','An optimization algorithm','A data preprocessing step','A neural layer'], ans:1 },
      { q:'What is the purpose of activation functions?', opts:['Store weights','Introduce non-linearity','Normalize data','Reduce parameters'], ans:1 },
      { q:'What does NLP stand for?', opts:['Neural Language Processing','Natural Language Processing','New Learning Paradigm','None'], ans:1 },
      { q:'What is transfer learning?', opts:['Moving data','Using a pre-trained model on a new task','Training from scratch','Data augmentation'], ans:1 },
      { q:'Which is a popular Python ML library?', opts:['React','Flask','Scikit-learn','jQuery'], ans:2 },
    ]
  }
};

const AI_RESPONSES = [
  'Great question! Based on your current progress, I recommend focusing on **React Hooks** next. They are fundamental to modern React development.',
  'I can see you are doing well in React.js (72% complete). Consider jumping to the **Node.js & Express** course next to build full-stack skills!',
  'For AI/ML learners, starting with **Python Essentials** and then moving to **Data Science with Python** is the ideal path. 🎯',
  'Your learning streak is impressive! 🔥 Consistent learners like you achieve certification 3x faster than average.',
  'Need help with a specific topic? I can break down any concept from your enrolled courses step-by-step.',
  'Based on industry trends, **React.js + Node.js + MongoDB** (MERN Stack) is one of the most in-demand skill sets right now!',
  'I noticed you have not taken any quizzes this week. Why not try the **React.js Fundamentals** quiz to test your knowledge?',
];

// ─── State ───
let currentCategory = 'all';
let currentQuiz = null;
let currentQuestion = 0;
let answers = [];
let timerInterval = null;

// ══════════════════════════════════════════════════
//  PAGE NAVIGATION
// ══════════════════════════════════════════════════
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');
  const navLink = document.getElementById(`nav-${name}`);
  if (navLink) navLink.classList.add('active');
  window.scrollTo(0, 0);
  closeNotifications();

  if (name === 'courses') renderCourses();
  if (name === 'dashboard') { renderMyCourses(); generateHeatmap(); }
  if (name === 'certificates') renderCertificates();
}

// ══════════════════════════════════════════════════
//  DASHBOARD SECTIONS
// ══════════════════════════════════════════════════
function showDashSection(name) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
  const section = document.getElementById(`ds-${name}`);
  if (section) section.classList.add('active');
  const navItem = document.getElementById(`dn-${name}`);
  if (navItem) navItem.classList.add('active');
  if (name === 'analytics') generateHeatmap();
}

// ══════════════════════════════════════════════════
//  COURSES
// ══════════════════════════════════════════════════
function renderCourses() {
  const grid = document.getElementById('coursesGrid');
  const search = document.getElementById('courseSearch')?.value.toLowerCase() || '';
  const filtered = COURSES.filter(c => {
    const matchCat = currentCategory === 'all' || c.category === currentCategory;
    const matchSearch = !search || c.title.toLowerCase().includes(search) || c.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  const levelClass = { Beginner:'beginner', Intermediate:'intermediate', Advanced:'advanced' };
  const catColors = {
    web:    { bg:'rgba(99,102,241,.08)',  color:'#6366F1' },
    ai:     { bg:'rgba(6,182,212,.08)',   color:'#06B6D4' },
    data:   { bg:'rgba(16,185,129,.08)', color:'#10B981' },
    design: { bg:'rgba(236,72,153,.08)', color:'#EC4899' },
    mobile: { bg:'rgba(139,92,246,.08)', color:'#8B5CF6' },
    other:  { bg:'rgba(245,158,11,.08)', color:'#F59E0B' },
  };

  grid.innerHTML = filtered.map(c => {
    const catC = catColors[c.category] || catColors.other;
    return `<div class="course-card" onclick="enrollCourse('${c.title}')">
      <div class="cc-thumb" style="background:${c.bg}">
        <div class="cc-thumb-icon" style="width:56px;height:56px;border-radius:14px;background:${catC.bg};color:${catC.color};display:flex;align-items:center;justify-content:center;border:1px solid ${catC.color}22">
          <i data-lucide="${c.lucide}" width="26" height="26"></i>
        </div>
      </div>
      <div class="cc-body">
        <span class="cc-tag" style="background:${catC.bg};color:${catC.color};border:1px solid ${catC.color}33">${c.category.toUpperCase()}</span>
        <div class="cc-title">${c.title}</div>
        <p class="cc-desc">${c.desc}</p>
        <div class="cc-meta">
          <span><i data-lucide="user" width="12" height="12"></i> ${c.instructor}</span>
          <span><i data-lucide="clock" width="12" height="12"></i> ${c.hours}h</span>
          <span><i data-lucide="signal" width="12" height="12"></i> ${c.level}</span>
        </div>
        <div class="cc-footer">
          <div class="cc-rating"><i data-lucide="star" width="13" height="13" style="color:#F59E0B;fill:#F59E0B"></i> ${c.rating} <span style="color:var(--text-3);font-size:.72rem">(${c.students.toLocaleString()})</span></div>
          <button class="cc-enroll">Enroll free</button>
        </div>
      </div>
    </div>`;
  }).join('') || '<div style="text-align:center;padding:4rem;color:var(--text-3)">No courses found. Try a different search.</div>';

  lucide.createIcons();
}

function setCategoryFilter(btn, cat) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = cat;
  renderCourses();
}

function filterCourses() { renderCourses(); }

async function enrollCourse(title) {
  // Try to find course by title in API data
  if (authToken && window.API_COURSES) {
    const course = window.API_COURSES.find(c => c.title === title);
    if (course) {
      try {
        const data = await apiCall(`/courses/${course._id}/enroll`, 'POST');
        showToast(`✅ ${data.message}`);
        if (data.xpEarned) showToast(`⚡ +50 XP earned!`);
        return;
      } catch(e) {
        if (e.message.includes('Already enrolled')) {
          showToast(`ℹ️ Already enrolled in "${title}"`);
          return;
        }
      }
    }
  }
  if (!authToken) {
    showToast('🔐 Please login to enroll in courses!');
    setTimeout(() => showModal('loginModal'), 800);
    return;
  }
  showToast(`✅ Enrolled in "${title}" successfully!`);
}

// ══════════════════════════════════════════════════
//  MY COURSES
// ══════════════════════════════════════════════════
function renderMyCourses() {
  const grid = document.getElementById('myCoursesGrid');
  if (!grid) return;
  grid.innerHTML = MY_COURSES.map(c => `
    <div class="dash-card" style="cursor:pointer" onclick="showPage('courses')">
      <div style="display:flex;align-items:center;gap:.875rem;margin-bottom:1rem">
        <div style="width:36px;height:36px;border-radius:8px;background:${c.color}18;color:${c.color};display:flex;align-items:center;justify-content:center;border:1px solid ${c.color}28;flex-shrink:0">
          <i data-lucide="${c.lucide}" width="18" height="18"></i>
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.9rem;margin-bottom:2px">${c.title}</div>
          <div style="font-size:.72rem;color:var(--text-3)">Module ${c.module} of ${c.total}</div>
        </div>
        ${c.progress === 100 ? `<i data-lucide="award" width="18" height="18" style="color:#F59E0B"></i>` : ''}
      </div>
      <div style="background:rgba(255,255,255,.07);border-radius:3px;height:5px;margin-bottom:.5rem">
        <div style="height:100%;border-radius:3px;width:${c.progress}%;background:${c.color};transition:width .4s"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:.75rem;color:var(--text-3)">${c.progress}% complete</span>
        <button class="cl-btn" onclick="event.stopPropagation();showPage('courses')">${c.progress === 100 ? 'Review' : 'Resume'} <i data-lucide="chevron-right" width="13" height="13"></i></button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

// ══════════════════════════════════════════════════
//  CERTIFICATES
// ══════════════════════════════════════════════════
function renderCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;
  grid.innerHTML = CERTIFICATES.map(c => `
    <div class="cert-card">
      <div class="cert-banner" style="background:${c.bg}">
        <div class="cert-banner-icon" style="background:rgba(255,255,255,.1);border-color:${c.color}55">
          <i data-lucide="${c.lucide}" width="22" height="22" style="color:${c.color}"></i>
        </div>
        <div class="cert-banner-label" style="color:${c.color}">Certificate of Completion</div>
      </div>
      <div class="cert-body">
        <div class="cert-title">${c.title}</div>
        <div class="cert-meta">Issued ${c.date} &nbsp;&bull;&nbsp; ${c.instructor}</div>
        <div class="cert-id"><i data-lucide="link" width="11" height="11"></i> ${c.id}</div>
        <div class="cert-actions">
          <button class="cert-dl" onclick="downloadCert('${c.title}')">
            <i data-lucide="download" width="14" height="14"></i> Download PDF
          </button>
          <button class="cert-share" onclick="shareCert('${c.id}')">
            <i data-lucide="share-2" width="14" height="14"></i> Share
          </button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function downloadCert(title) {
  showToast(`Downloading "${title}" certificate...`);
  setTimeout(() => showToast('Certificate downloaded successfully!'), 1500);
}

function shareCert(id) {
  navigator.clipboard?.writeText(`https://horizon.anshsofttech.com/verify/${id}`).catch(()=>{});
  showToast('Verification link copied to clipboard!');
}

// ══════════════════════════════════════════════════
//  MODULES TAB
// ══════════════════════════════════════════════════
function switchModule(btn, name) {
  document.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.module-content').forEach(m => m.classList.add('hidden'));
  const mc = document.getElementById(`module-${name}`);
  if (mc) mc.classList.remove('hidden');
}

// ══════════════════════════════════════════════════
//  QUIZ ENGINE
// ══════════════════════════════════════════════════
function startQuiz(key) {
  currentQuiz = QUIZZES[key];
  currentQuestion = 0;
  answers = new Array(currentQuiz.questions.length).fill(null);

  document.getElementById('quiz-select-screen').classList.add('hidden');
  document.getElementById('quiz-active-screen').classList.remove('hidden');
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-topic-label').textContent = currentQuiz.label;

  startTimer(currentQuiz.time * 60);
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuiz.questions[currentQuestion];
  document.getElementById('quizQuestion').textContent = `Q${currentQuestion + 1}. ${q.q}`;
  document.getElementById('quiz-q-counter').textContent = `Q ${currentQuestion + 1} / ${currentQuiz.questions.length}`;
  document.getElementById('quizProgressFill').style.width = `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%`;
  document.getElementById('quizPrev').disabled = currentQuestion === 0;
  document.getElementById('quizNext').textContent = currentQuestion === currentQuiz.questions.length - 1 ? 'Submit ✓' : 'Next →';

  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('quizOptions').innerHTML = q.opts.map((opt, i) => `
    <div class="quiz-option ${answers[currentQuestion] === i ? 'selected' : ''}" onclick="selectAnswer(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <span>${opt}</span>
    </div>
  `).join('');
}

function selectAnswer(idx) {
  answers[currentQuestion] = idx;
  document.querySelectorAll('.quiz-option').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
}

function nextQuestion() {
  if (currentQuestion < currentQuiz.questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

  // Remove emoji toast prefixes in quiz submit
function submitQuiz() {
  clearInterval(timerInterval);
  const score = answers.reduce((acc, ans, i) => acc + (ans === currentQuiz.questions[i].ans ? 1 : 0), 0);
  const total = currentQuiz.questions.length;

  document.getElementById('quiz-active-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.remove('hidden');

  document.getElementById('resultScore').textContent = `${score} / ${total}`;
  const pct = (score / total) * 100;
  const icon = document.getElementById('resultIcon');
  if (pct >= 80) {
    icon.innerHTML = '<i data-lucide="check-circle" width="48" height="48" style="color:#10B981"></i>';
    document.getElementById('resultTitle').textContent = 'Excellent!';
    document.getElementById('resultMsg').textContent = `Outstanding! You scored ${score}/${total}. You qualify for the certificate.`;
  } else if (pct >= 60) {
    icon.innerHTML = '<i data-lucide="thumbs-up" width="48" height="48" style="color:#6366F1"></i>';
    document.getElementById('resultTitle').textContent = 'Good Job!';
    document.getElementById('resultMsg').textContent = `You scored ${score}/${total}. A little more practice and you will ace it!`;
  } else {
    icon.innerHTML = '<i data-lucide="book-open" width="48" height="48" style="color:#F59E0B"></i>';
    document.getElementById('resultTitle').textContent = 'Keep Practicing!';
    document.getElementById('resultMsg').textContent = `You scored ${score}/${total}. Review the course material and try again.`;
  }
  lucide.createIcons();
  showToast(`Quiz complete — you scored ${score}/${total}`);
}

function resetQuiz() {
  clearInterval(timerInterval);
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-active-screen').classList.add('hidden');
  document.getElementById('quiz-select-screen').classList.remove('hidden');
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  let remaining = seconds;
  const el = document.getElementById('quizTimer');
  timerInterval = setInterval(() => {
    remaining--;
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    el.textContent = `⏱️ ${m}:${s}`;
    if (remaining <= 60) el.style.color = '#FF6B6B';
    if (remaining <= 0) submitQuiz();
  }, 1000);
}

// ══════════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════════
function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('open');
}

function closeNotifications() {
  document.getElementById('notifPanel')?.classList.remove('open');
}

function clearNotifications() {
  document.querySelectorAll('.notif-item').forEach(item => item.classList.remove('unread'));
  document.getElementById('notifCount').textContent = '0';
  document.getElementById('notifCount').style.opacity = '0';
  showToast('✅ All notifications marked as read');
}

document.addEventListener('click', (e) => {
  const panel = document.getElementById('notifPanel');
  const bell  = document.getElementById('notifBell');
  if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// ══════════════════════════════════════════════════
//  MODALS
// ══════════════════════════════════════════════════
function showModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}
function closeModalOutside(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}
function switchModal(close, open) {
  closeModal(close);
  setTimeout(() => showModal(open), 150);
}

async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;
  const btn      = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Logging in...';
  btn.disabled = true;
  try {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem('horizon_token', authToken);
    localStorage.setItem('horizon_user', JSON.stringify(currentUser));
    closeModal('loginModal');
    showToast(`👋 ${data.message}`);
    setTimeout(() => showPage('dashboard'), 500);
  } catch(err) {
    showToast(`❌ ${err.message}`);
  } finally {
    btn.textContent = 'Login →';
    btn.disabled = false;
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value;
  const email    = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPass').value;
  const role     = document.getElementById('signupRole').value;
  const btn      = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Creating account...';
  btn.disabled = true;
  try {
    const data = await apiCall('/auth/register', 'POST', { name, email, password, role });
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem('horizon_token', authToken);
    localStorage.setItem('horizon_user', JSON.stringify(currentUser));
    closeModal('signupModal');
    showToast(`🎉 ${data.message}`);
    setTimeout(() => showPage('courses'), 600);
  } catch(err) {
    showToast(`❌ ${err.message}`);
  } finally {
    btn.textContent = 'Create Account →';
    btn.disabled = false;
  }
}

// ══════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ══════════════════════════════════════════════════
//  CHATBOT
// ══════════════════════════════════════════════════
function toggleChat() {
  document.getElementById('chatWindow').classList.toggle('open');
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addChatMsg(text, 'user');
  addTypingIndicator();

  // Try real backend AI if logged in
  if (authToken) {
    try {
      const data = await apiCall('/ai/chat', 'POST', { message: text });
      removeTypingIndicator();
      addChatMsg(data.reply, 'bot');
      return;
    } catch(e) { /* fall through to demo */ }
  }

  // Fallback demo response (Local smart matching)
  setTimeout(() => {
    removeTypingIndicator();
    let reply = '';
    const msg = text.toLowerCase();
    
    if (msg.includes('react') || msg.includes('frontend')) {
      reply = "React.js is one of our most popular courses! I'd recommend starting with React.js Mastery — it covers Hooks, Context API, and advanced patterns.";
    } else if (msg.includes('python') || msg.includes('ai') || msg.includes('ml')) {
      reply = "For AI/ML, our Python for AI & ML course is perfect. Start with Python fundamentals, then move to Machine Learning A-Z.";
    } else if (msg.includes('certificate') || msg.includes('cert')) {
      reply = "Certificates are issued automatically when you pass a quiz with an 80%+ score or complete a course. You can download them as PDF from the Certificates section.";
    } else if (msg.includes('quiz') || msg.includes('test')) {
      reply = "Our adaptive quiz engine tests your knowledge with timed questions. Score 80%+ to pass and earn a certificate! Head to the Assessments section to try one now.";
    } else if (msg.includes('progress') || msg.includes('dashboard')) {
      reply = "Check your Dashboard -> Analytics section for detailed performance insights — skill proficiency, weekly study hours, streak, and achievements.";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      reply = "Hello! I'm Horizon AI. I can help you choose courses, explain concepts, or track your progress. Note: You are currently in demo mode. Sign in to access full AI capabilities.";
    } else {
      reply = "I understand you're asking about something specific. Since you're not logged in, my capabilities are limited. Try asking about our courses (React, Python), certificates, or quizzes!";
    }
    
    addChatMsg(reply, 'bot');
  }, 1200 + Math.random() * 800);
}

function addChatMsg(text, role) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `
    <div class="cm-ava">${role === 'bot' ? '<i data-lucide="bot" width="14" height="14"></i>' : '<i data-lucide="user" width="14" height="14"></i>'}</div>
    <div class="cm-bubble">${text}</div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  lucide.createIcons();
}

function addTypingIndicator() {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="cm-ava"><i data-lucide="bot" width="14" height="14"></i></div><div class="cm-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  lucide.createIcons();
}

function removeTypingIndicator() {
  document.getElementById('typing-indicator')?.remove();
}

// ══════════════════════════════════════════════════
//  NAV SCROLL & MOBILE MENU
// ══════════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ══════════════════════════════════════════════════
//  STATS COUNTER ANIMATION
// ══════════════════════════════════════════════════
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

// ══════════════════════════════════════════════════
//  PARTICLES
// ══════════════════════════════════════════════════
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: ${Math.random() > 0.5 ? '#6C63FF' : '#00D4FF'};
      animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%,100% { transform: translateY(0) translateX(0) scale(1); }
      33% { transform: translateY(-40px) translateX(20px) scale(1.2); }
      66% { transform: translateY(-20px) translateX(-20px) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
}

// ══════════════════════════════════════════════════
//  HEATMAP GENERATION
// ══════════════════════════════════════════════════
function generateHeatmap() {
  const heatmap = document.getElementById('heatmap');
  if (!heatmap || heatmap.children.length > 0) return;
  const levels = ['hc-0','hc-1','hc-2','hc-3','hc-4'];
  for (let i = 0; i < 35; i++) {
    const cell = document.createElement('div');
    cell.className = `hc ${levels[Math.floor(Math.random() * 5)]}`;
    cell.title = `${Math.floor(Math.random() * 4)}h studied`;
    heatmap.appendChild(cell);
  }
}

// ══════════════════════════════════════════════════
//  INTERSECTION OBSERVER (feature cards)
// ══════════════════════════════════════════════════
function setupObserver() {
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .tech-pill').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderCourses();
  renderCertificates();
  renderMyCourses();
  lucide.createIcons();

  setTimeout(animateCounters, 600);
  checkBackend();

  if (currentUser) {
    showToast(`Welcome back, ${currentUser.name}!`);
  }

  setTimeout(setupObserver, 300);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('loginModal');
      closeModal('signupModal');
      closeNotifications();
      document.getElementById('chatWindow')?.classList.remove('open');
    }
  });

  console.log('%cProject Horizon — Ansh Soft Tech', 'font-size:16px;font-weight:bold;color:#6366F1;');
  console.log('%cLearning & Skill Development Platform', 'font-size:11px;color:#06B6D4;');
});
