const basicAuth = require('express-basic-auth');
module.exports = function addUIRoute(app){
  // Basic Authentication Middleware
app.use(basicAuth({
  users: { 'ta12': 'ta12@fullmoontech' }, 
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

app.get('/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/statistic.html'));
});

app.get('/dispose', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/dispose.html'));
});
}