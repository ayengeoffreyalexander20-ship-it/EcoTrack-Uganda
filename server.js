
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = process.env.JWT_SECRET || 'uganda-green-shield-2024';
const DB_FILE = path.join(__dirname, 'db.json');

// Initial Database State with a Demo Account
const demoPasswordHash = bcrypt.hashSync('password123', 10);
const initialDb = {
  users: [
    {
      id: 'demo-user-123',
      email: 'demo@ecotrack.ug',
      password: demoPasswordHash,
      name: 'Kato Paul (Demo)',
      district: 'Mbarara',
      location: 'Mbarara City',
      age: 28,
      occupation: 'Environmental Lead',
      type: 'INDIVIDUAL',
      points: 2500,
      joinedDate: '2024-01-01T10:00:00.000Z',
      avatar: 'Paul',
      isPremium: true,
      language: 'EN'
    }
  ],
  activities: [
    {
      id: 'act-demo-1',
      userId: 'demo-user-123',
      category: 'Transport',
      subcategory: 'Bicycle',
      description: 'Commute to Mbarara Market',
      co2e: 0,
      value: 5,
      unit: 'km',
      timestamp: new Date().toISOString(),
      details: {}
    }
  ],
  videos: [
    {
      id: '1',
      title: 'Solar Power in Rural Uganda',
      description: 'Learn how remote villages are harnessing the sun to power schools and clinics.',
      category: 'Energy',
      thumbnail: 'https://picsum.photos/400/250?random=10',
      views: 12450,
      likes: 842,
      duration: '5:24',
      author: 'EcoPulse'
    }
  ],
  challenges: [
    {
      id: 'ch-1',
      title: 'Boda-Free Week',
      description: 'Walk or cycle to work for 5 days in Mbarara.',
      participants: 1240,
      userProgress: 0,
      target: 15,
      daysRemaining: 5,
      category: 'Transport',
      points: 500,
      image: 'https://picsum.photos/400/200?random=1'
    }
  ],
  userChallenges: []
};

// Database Helper
const getDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
};

const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/users/google-login/', async (req, res) => {
  const { token } = req.body;
  const db = getDb();
  const email = `google_user_${token.slice(-5)}@gmail.com`;
  const name = "Google User " + token.slice(-4);
  const googleId = "google_" + token;

  let user = db.users.find(u => u.email === email || u.googleId === googleId);

  if (!user) {
    user = {
      id: uuidv4(),
      googleId,
      email,
      name,
      district: 'Mbarara',
      type: 'INDIVIDUAL',
      points: 100,
      joinedDate: new Date().toISOString(),
      avatar: name.charAt(0),
      isPremium: true
    };
    db.users.push(user);
    saveDb(db);
  }

  const jwtToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token: jwtToken, user: userWithoutPassword });
});

app.post('/api/users/register/', async (req, res) => {
  const { email, password, name, district, location, age, occupation } = req.body;
  const db = getDb();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    district,
    location,
    age,
    occupation,
    type: 'INDIVIDUAL',
    points: 100,
    joinedDate: new Date().toISOString(),
    avatar: name.charAt(0),
    isPremium: true
  };

  db.users.push(newUser);
  saveDb(db);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, user: userWithoutPassword });
});

app.post('/api/users/login/', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

app.get('/api/users/profile/', authenticateToken, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/profile/update/', authenticateToken, (req, res) => {
  const db = getDb();
  const index = db.users.findIndex(u => u.id === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  db.users[index] = { ...db.users[index], ...req.body };
  saveDb(db);
  const { password: _, ...userWithoutPassword } = db.users[index];
  res.json(userWithoutPassword);
});

// --- ACTIVITY ENDPOINTS ---

app.get('/api/activities/', authenticateToken, (req, res) => {
  const db = getDb();
  const userActivities = db.activities
    .filter(a => a.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(userActivities);
});

app.post('/api/activities/', authenticateToken, (req, res) => {
  const { type, description, subcategory, carbon_footprint, quantity, details } = req.body;
  const db = getDb();
  const newActivity = {
    id: uuidv4(),
    userId: req.user.id,
    category: type.charAt(0).toUpperCase() + type.slice(1),
    subcategory,
    description,
    co2e: carbon_footprint,
    value: quantity,
    unit: details?.unit || 'qty',
    timestamp: new Date().toISOString(),
    details: details || {}
  };
  db.activities.push(newActivity);
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) { db.users[userIndex].points += 10; }
  saveDb(db);
  res.status(201).json(newActivity);
});

app.delete('/api/activities/:id/', authenticateToken, (req, res) => {
  const db = getDb();
  db.activities = db.activities.filter(a => !(a.id === req.params.id && a.userId === req.user.id));
  saveDb(db);
  res.status(204).send();
});

// --- VIDEO ENDPOINTS ---

app.get('/api/videos/', (req, res) => {
  res.json(getDb().videos);
});

app.post('/api/videos/upload/', authenticateToken, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  const newVideo = {
    id: uuidv4(),
    ...req.body,
    views: 0,
    likes: 0,
    author: user.name,
    duration: '3:00'
  };
  db.videos.unshift(newVideo);
  saveDb(db);
  res.status(201).json(newVideo);
});

// --- CHALLENGE ENDPOINTS ---

app.get('/api/challenges/', authenticateToken, (req, res) => {
  const db = getDb();
  const challengesWithStatus = db.challenges.map(c => ({
    ...c,
    isJoined: db.userChallenges.some(uc => uc.userId === req.user.id && uc.challengeId === c.id)
  }));
  res.json(challengesWithStatus);
});

app.post('/api/challenges/join/', authenticateToken, (req, res) => {
  const { challengeId } = req.body;
  const db = getDb();
  
  if (db.userChallenges.some(uc => uc.userId === req.user.id && uc.challengeId === challengeId)) {
    return res.status(400).json({ message: 'Already joined' });
  }

  db.userChallenges.push({ userId: req.user.id, challengeId });
  const challenge = db.challenges.find(c => c.id === challengeId);
  if (challenge) challenge.participants += 1;
  
  saveDb(db);
  res.json({ message: 'Joined successfully' });
});

// --- LEADERBOARD ---

app.get('/api/users/leaderboard/', (req, res) => {
  const db = getDb();
  const leaderboard = db.users
    .map(u => ({
      id: u.id,
      name: u.name,
      points: u.points,
      district: u.district,
      type: u.type,
      avatar: u.avatar
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 20);
  res.json(leaderboard);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`
  🚀 EcoTrack Uganda Backend Running!
  -----------------------------------
  URL: http://localhost:${PORT}
  Database: ${DB_FILE}
  -----------------------------------
  `);
});
