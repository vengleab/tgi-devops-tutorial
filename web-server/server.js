const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Hardcoded user
const USER = { username: 'admin', password: 'password' };

// In-memory articles
let articles = [
  { id: 1, title: 'Welcome Article', description: 'This is the first article.' }
];

// Simple session (in-memory, for demo only)
let sessions = {};

// Helper: generate token
function generateToken() {
  return Math.random().toString(36).substr(2);
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    const token = generateToken();
    sessions[token] = username;
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get articles (public)
app.get('/articles', (req, res) => {
  res.json(articles);
});

// Post article (auth required)
app.post('/articles', (req, res) => {
  const { token, title, description } = req.body;
  if (!token || !sessions[token]) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description required' });
  }
  const newArticle = {
    id: articles.length + 1,
    title,
    description
  };
  articles.push(newArticle);
  res.json({ success: true, article: newArticle });
});

// Logout (optional)
app.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token && sessions[token]) {
    delete sessions[token];
  }
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 