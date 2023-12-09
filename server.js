const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log(err.stack);
  console.log('uncaught exception occurred, shutting down the server...');

  process.exit(1); //uncaught exception
});

const app = require('./app');
console.log(`currently in: ${app.get('env')} environment`);

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  console.log(process.env.TZ);
  console.log('server running!!');
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('unhandled rejection occurred , shutting down the server...');

  server.close(async () => {
    await sequelize.close();
    process.exit(1); //uncaught exception
  });
});
