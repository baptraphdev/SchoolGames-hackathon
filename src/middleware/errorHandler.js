/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.details || message
    });
  }

  // Handle Firebase errors
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(400).json({
      success: false,
      error: 'Database Error',
      message: err.message
    });
  }

  // Handle not found errors
  if (err.statusCode === 404) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message
    });
  }

  // Generic error response
  res.status(status).json({
    success: false,
    error: err.name || 'Error',
    message
  });
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  ApiError
};