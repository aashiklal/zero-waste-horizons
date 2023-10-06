const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();
const uiRouter = require('./router/UIRoute')
const apiRouter = require('./router/ApiRouter')


const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none';default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self';");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use('/api',apiRouter)
app.use('/', uiRouter);

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
