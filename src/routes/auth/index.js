const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("http-status");
const UserAuthentication = require("../../middleware/userMiddleware");
const { User } = require("../../schema/userSchema");
module.exports = function () {
  const api = express.Router();

  api.post("/", async (req, res) => {
    try {
      const data = req.body;
      const { name, email, password } = data;

      const splitedName = name.split(" ");
      const firstName = splitedName.slice(0, 1).toString();
      const lastName = splitedName.slice(1).toString();
      const existingEmail = await User.findOne({ email: email });

      if (existingEmail) {
        return res
          .status(status.NOT_FOUND)
          .json({ error: "Email Already exist" });
      }
      const cryptedPassword = await bcrypt.hash(password, 10);

      data.password = cryptedPassword;
      data.name = firstName;
      data.lastName = lastName;
      data.location = "My city";
      const create = await User.create(data);

      console.log(create);
      const token = await jwt.sign(
        {
          ...create,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        },
        "user"
      );

      return res.json({ ...create._doc, token: token });
    } catch (error) {
      return res.status(status.CONFLICT).json({ error });
    }
  });
  api.post("/login", async (req, res) => {
    try {
      console.log("reached login");
      const loginData = req.body;

      let existingUser = await User.findOne({ email: loginData.email });
      if (existingUser) {
        const verified = await bcrypt.compare(
          loginData.password,
          existingUser.password
        );
        if (verified) {
          const token = await jwt.sign(
            {
              ...existingUser,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
            },
            "user"
          );

          return res.json({ ...existingUser._doc, token: token });
        } else {
          return res.status(status.UNAUTHORIZED).json("Incorrect Password");
        }
      } else {
        return res.status(status.UNAUTHORIZED).json("User Does not exist");
      }
    } catch (error) {
      return res.status(status.NOT_FOUND).status(error);
    }
  });
  api.use(UserAuthentication());
  api.get("/me", async (req, res) => {
    try {
      const user = req.user;
      const token = req.token;
      if (!user) {
        return res.status(status.UNAUTHORIZED).json("User not login");
      } else {
        return res.json({ ...user._doc, token });
      }
    } catch (error) {
      return res.status(status.NOT_FOUND).json(error);
    }
  });
  return api;
};
