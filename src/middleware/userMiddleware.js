const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

module.exports = function UserAuthentication() {
  return async function (req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: "TOKEN  NOT AVILABLE" });
      }

      const verified = await jwt.decode(token, secret);

      if (verified) {
        req.user = verified;
        req.token = token;

        return next();
      } else {
        return res.status(httpStatus.UNAUTHORIZED).json("Token Expired");
      }
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  };
};
