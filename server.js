const sequelize = require("./utils/dbConn");
const User = require("./Models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log(err.stack);
  console.log("uncaught exception occurred, shutting down the server...");

  process.exit(1); //uncaught exception
});

const app = require("./app");
console.log(`currently in: ${app.get("env")} environment`);

const startDB = async () => {
  try {
    await sequelize.authenticate();
    await User.sync({ force: true });
    console.log("\n\nConnection has been established successfully.\n\n");
  } catch (error) {
    console.log("\n\nUnable to connect to the database: ", error.message);
  }
};

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  await startDB();
  console.log("server running!!");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejection occurred , shutting down the server...");

  server.close(async () => {
    await sequelize.close();
    process.exit(1); //uncaught exception
  });
});
