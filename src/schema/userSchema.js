const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Invalid E-mail"],
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isMember: {
    type: Boolean,
  },
  role: {
    type: String,
    default: "User",
    enum: ["User", "Admin"],
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
