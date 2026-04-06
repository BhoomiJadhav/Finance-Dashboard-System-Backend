const ApiError = require("../utils/ApiError");

const { env } = require("../config/env");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value found";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
    details = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.message) {
    message = err.message;
  }

  const response = {
    success: false,
    message,
  };
  if (details) response.errors = details;
  if (env.nodeEnv !== "production" && statusCode === 500) {
    response.debug = { error: err.message };
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
