const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught exception occurred, shutting down the server...');

  process.exit(1); //uncaught exception
});

const app = require('./app');
console.log(`currently in: ${app.get('env')} environment`);

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((connObj) => {
    console.log('DB connnection successful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('server running!!');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection occurred , shutting down the server...');

  server.close(() => {
    process.exit(1); //uncaught exception
  });
});
