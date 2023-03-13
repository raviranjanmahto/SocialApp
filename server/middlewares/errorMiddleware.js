const AppError = require("../utils/appError");

const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDb = err => {
  const name = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field "${name}: ${value}". Please use another ${name}!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });

    // Programming or other unknown error: don't leak error details
  } else {
    res
      .status(500)
      .json({ status: "error", message: "Something went very wrong!" });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong!";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldDb(err);
    if (err.name === "ValidationError") err = handleValidationErrorDb(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpireError(err);
    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
