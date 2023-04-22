const express = require("express");
const status = require("http-status");
const Auth = require("./auth");
const UserRoute = require("./UserRoute");
const Job = require("./jobRoutes/");

module.exports = function Routes() {
  const api = express();

  api.use("/auth", Auth());
  api.use("/user", UserRoute());
  api.use("/job", Job());
  api.get("*", (req, res) => {
    console.log("invalid api", req.body);
    res.status(status.NOT_FOUND).json({ error: "invalid api" });
  });
  return api;
};
