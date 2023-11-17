const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.DB_ENGINE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  /* dialectOptions: {
    useUTC: false,
  }, */
  timezone: "America/Santiago",
});

module.exports = sequelize;
