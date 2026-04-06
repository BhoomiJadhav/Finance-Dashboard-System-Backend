const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  const user = await User.findById(decoded.userId);
  if (!user) throw new ApiError(401, "User not found");
  if (user.status !== "active") throw new ApiError(403, "User is inactive");

  req.user = user;
  next();
});

module.exports = { protect };
