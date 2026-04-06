const ApiError = require("../utils/ApiError");

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(
      403,
      `Role '${req.user.role}' is not allowed to access this resource`
    );
  }
  next();
};

module.exports = { authorizeRoles };
