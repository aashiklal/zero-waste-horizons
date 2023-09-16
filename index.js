const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();
const uiRouter = require('./router/UIRoute')
const apiRouter = require('./router/ApiRouter')


const port = process.env.PORT || 3000;


app.use(cors())
app.use(express.static(path.join(__dirname, './frontend')));

app.use('/api',apiRouter)
app.use('/', uiRouter);


app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
