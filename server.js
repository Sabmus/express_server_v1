const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = require("./app");
console.log(`currently in: ${app.get("env")} environment`);

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((connObj) => {
    console.log("DB connnection successful");
  })
  .catch((error) => {
    console.log(error.message);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server running!!");
});
