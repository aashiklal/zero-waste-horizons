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

module.exports = uiRouter