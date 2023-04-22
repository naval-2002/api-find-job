const express = require("express");
const userMiddleware = require("../../middleware/userMiddleware");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const { OK } = require("http-status");
const { isEmail } = require("validator");

module.exports = function User() {
  const api = express.Router();
  const { User } = require("../../schema/userSchema");

  api.use(userMiddleware());

  api.get("/", async (req, res) => {});
  api.patch("/update", async (req, res) => {
    try {
      let updateData = req.body;

      const verified = req.user._doc;
      const id = verified._id;
      // const newEmail = updateData.email;

      // if (!isEmail(newEmail)) {
      //   return res.status(httpStatus.BAD_REQUEST).json("Invalid email address");
      // }
      console.log(updateData);
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      return res.status(OK).json(updatedUser);
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).json({ error });
    }
  });
  api.delete("/get", async (req, res) => {});
  return api;
};
