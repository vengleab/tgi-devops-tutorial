const request = require('supertest');

// Import the actual server app
const app = require('./server');
let server;

// Setup test server
beforeAll(() => {
  server = app.listen(0); // Use port 0 for testing
});

afterAll((done) => {
  server.close(done);
});

describe('Article Management API', () => {
  let authToken;

  describe('POST /login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'admin' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /articles', () => {
    test('should return all articles (public endpoint)', async () => {
      const response = await request(app)
        .get('/articles')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
    });
  });

  describe('POST /articles', () => {
    test('should create new article with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      
      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/articles')
        .send({
          token,
          title: 'Test Article',
          description: 'This is a test article'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.article).toHaveProperty('id');
      expect(response.body.article.title).toBe('Test Article');
      expect(response.body.article.description).toBe('This is a test article');
    });

    test('should reject article creation without token', async () => {
      const response = await request(app)
        .post('/articles')
        .send({
          title: 'Test Article',
          description: 'This is a test article'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('should reject article creation with invalid token', async () => {
      const response = await request(app)
        .post('/articles')
        .send({
          token: 'invalid-token',
          title: 'Test Article',
          description: 'This is a test article'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('should reject article creation without title', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      
      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/articles')
        .send({
          token,
          description: 'This is a test article'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and description required');
    });

    test('should reject article creation without description', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      
      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/articles')
        .send({
          token,
          title: 'Test Article'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and description required');
    });
  });

  describe('POST /logout', () => {
    test('should logout successfully with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      
      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/logout')
        .send({ token })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should handle logout without token', async () => {
      const response = await request(app)
        .post('/logout')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should handle logout with invalid token', async () => {
      const response = await request(app)
        .post('/logout')
        .send({ token: 'invalid-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('should maintain session state across requests', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      
      const token = loginResponse.body.token;

      // Create article
      const createResponse = await request(app)
        .post('/articles')
        .send({
          token,
          title: 'Integration Test Article',
          description: 'Testing session persistence'
        });

      expect(createResponse.body.success).toBe(true);

      // Logout
      const logoutResponse = await request(app)
        .post('/logout')
        .send({ token });

      expect(logoutResponse.body.success).toBe(true);

      // Try to create another article (should fail)
      const failResponse = await request(app)
        .post('/articles')
        .send({
          token,
          title: 'Should Fail',
          description: 'This should fail after logout'
        });

      expect(failResponse.status).toBe(401);
    });
  });
}); 