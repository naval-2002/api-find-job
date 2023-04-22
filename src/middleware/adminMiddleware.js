const httpStatus = require("http-status");

module.exports = function AdminMiddleware() {
  return async function (req, res, next) {
    try {
      console.log(req.user, req.user._doc.role);
      console.log(!req.user || !req.user._doc.role !== "Admin");
      if (!req.user || req.user.role !== "Admin") {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(`User is not ${!req.user ? "available" : "Admin"}  `);
      }
      next();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json(error);
    }
  };
};
