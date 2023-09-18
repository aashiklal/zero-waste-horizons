const basicAuth = require('express-basic-auth');
const path = require('path')
const express = require('express')

  // Basic Authentication Middleware
const uiRouter = express.Router();

uiRouter.use(basicAuth({
  users: { 'ta12': 'ta12@fullmoontech' },
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}));

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

// Catch-all middleware for 404 error page
uiRouter.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/pagenotfound.html'));
});

module.exports = uiRouter