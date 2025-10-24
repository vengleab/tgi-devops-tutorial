const API_URL = 'http://localhost/api';

// Elements
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const logoutSection = document.getElementById('logout-section');
const logoutBtn = document.getElementById('logout-btn');
const welcomeUser = document.getElementById('welcome-user');
const postSection = document.getElementById('post-section');
const postForm = document.getElementById('post-form');
const postMessage = document.getElementById('post-message');
const articlesList = document.getElementById('articles-list');

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

function showLogin() {
  loginSection.style.display = '';
  logoutSection.style.display = 'none';
  postSection.style.display = 'none';
}

function showUser(username) {
  loginSection.style.display = 'none';
  logoutSection.style.display = '';
  postSection.style.display = '';
  welcomeUser.textContent = `Welcome, ${username}`;
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  loginMessage.textContent = '';
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      showUser(username);
      loginForm.reset();
      fetchArticles();
    } else {
      loginMessage.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    loginMessage.textContent = 'Error connecting to server';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  const token = getToken();
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  clearToken();
  showLogin();
  fetchArticles();
});

// Post Article
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  postMessage.textContent = '';
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, title, description })
    });
    const data = await res.json();
    if (data.success) {
      postForm.reset();
      postMessage.textContent = 'Article posted!';
      fetchArticles();
    } else {
      postMessage.textContent = data.message || 'Failed to post article';
    }
  } catch (err) {
    postMessage.textContent = 'Error connecting to server';
  }
});

// Fetch Articles
async function fetchArticles() {
  articlesList.innerHTML = '<li>Loading...</li>';
  try {
    const res = await fetch(`${API_URL}/articles`);
    const articles = await res.json();
    if (Array.isArray(articles)) {
      if (articles.length === 0) {
        articlesList.innerHTML = '<li>No articles yet.</li>';
      } else {
        articlesList.innerHTML = '';
        articles.forEach(article => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${article.title}</strong><br>${article.description}`;
          articlesList.appendChild(li);
        });
      }
    } else {
      articlesList.innerHTML = '<li>Error loading articles.</li>';
    }
  } catch (err) {
    articlesList.innerHTML = '<li>Error connecting to server.</li>';
  }
}

// On load, check login state
window.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token) {
    // Assume user is admin if token exists (for demo)
    showUser('admin');
  } else {
    showLogin();
  }
  fetchArticles();
}); 