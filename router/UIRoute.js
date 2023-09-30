const basicAuth = require('express-basic-auth');
const path = require('path')
const express = require('express')

  // Basic Authentication Middleware
const uiRouter = express.Router();

uiRouter.use((req, res, next) => {
  const host = req.headers.host
  if (host === 'fullmoontech.me') {
    return basicAuth({
      users: { 'ta12': 'ta12@fullmoontech' },
      challenge: true,
      unauthorizedResponse: 'Unauthorized'
    })(req, res, next);
  }
  next();
});


//Main Routes
uiRouter.use(express.static(path.join(__dirname, '../frontend')));

uiRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

uiRouter.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

uiRouter.get('/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/statistic.html'));
});

uiRouter.get('/dispose', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dispose.html'));
});

// Iteration 1 Routes
// Serve static assets from the iteration1 folder
uiRouter.use('/iteration1', express.static(path.join(__dirname, '../iteration1')));

// Define routes for iteration 1 frontend
uiRouter.get('/iteration1', (req, res) => {
  res.sendFile(path.join(__dirname, '../iteration1/index.html'));
});

uiRouter.get('/iteration1/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../iteration1/index.html'));
});

uiRouter.get('/iteration1/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, '../iteration1/statistic.html'));
});

// Dev Routes
// Serve static assets from the iteration1 folder
uiRouter.use('/dev', express.static(path.join(__dirname, '../dev')));

// Define routes for iteration 1 frontend
uiRouter.get('/dev', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/index.html'));
});

uiRouter.get('/dev/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/index.html'));
});

uiRouter.get('/dev/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/statistic.html'));
});

uiRouter.get('/dev/dispose', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/dispose.html'));
});

uiRouter.get('/dev/classify', (req, res) => {
  res.sendFile(path.join(__dirname, '../dev/classify.html'));
});

// Catch-all middleware for 404 error page
uiRouter.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/pagenotfound.html'));
});

module.exports = uiRouter