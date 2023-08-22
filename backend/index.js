const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const app = express();

const port = process.env.PORT || 3000;

// connect to sql
let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('connetced to sql db');
});
app.use(cors())

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/test', (req, res) => {
  res.json({test:123});
});
app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
