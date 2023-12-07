module.exports = {
  development: {
    username: 'sabmus',
    password: 'admin',
    database: 'dev_db',
    host: process.env.POSTGRES_DEV_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
  },
};
