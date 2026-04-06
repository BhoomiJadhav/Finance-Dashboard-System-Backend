const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service");

const register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data,
  });
});

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data,
  });
});

module.exports = { register, login };
