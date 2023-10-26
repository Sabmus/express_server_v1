const express = require('express');
let app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});

app.listen(port, () => {
  console.log('server running!');
});
