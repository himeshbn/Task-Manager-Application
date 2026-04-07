// Jest setup: set NODE_ENV before any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRE = '7d';
// Use local MongoDB for tests (CI provides this via service container)
// Locally: install MongoDB or use MongoDB Memory Server
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager_test';
