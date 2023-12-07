const sequelize = require('./utils/dbConn');
//const Transaction = require('./Models/transactionModel');
//const Role = require('./Models/roleModel');
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

const startDB = async () => {
  try {
    await sequelize.authenticate();
    // permanent hook that validates updates to not be able to change UserIds
    sequelize.addHook('beforeSave', model => {
      if (model.UserId) {
        if (model.changed('UserId') && !model.isNewRecord) {
          model.UserId = model.previous('UserId');
        }
      }
    });

    await sequelize.sync({ force: true });
    await Role.create({
      name: 'Usuario',
    });
    console.log('\n\nConnection has been established successfully.\n\n');
  } catch (error) {
    console.log('\n\nUnable to connect to the database: ', error.message);
  }
};

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  //await startDB();
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
