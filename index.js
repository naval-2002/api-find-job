const express = require("express");
require("./src/database/db");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;
const app = express();
const routes = require("./src/routes");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Access-Control-Allow-Credentials", "true");
  res.json("Api is running");
});
app.use("/api/v1", routes());

app.listen(port, function (req, res) {
  console.log("connected successfully");
});
