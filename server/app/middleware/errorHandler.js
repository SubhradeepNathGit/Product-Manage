// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer file upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }

  // Validation & Custom errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }

  // Default: Internal Server Error
  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
