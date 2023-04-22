const mongoose = require("mongoose");
require("dotenv").config();

const dbPort = process.env.MONGO_DB_URL;

mongoose
  .connect(dbPort, {})
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log("error in db coonection ", error);
  });
