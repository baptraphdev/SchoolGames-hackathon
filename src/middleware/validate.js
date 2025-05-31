const Joi = require('joi');
const { ApiError } = require('./errorHandler');

/**
 * Middleware for validating request body/params/query with Joi
 * @param {Object} schema - Joi validation schema object with body, params, and query properties
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,  // Include all errors
      allowUnknown: true, // Ignore unknown props
      stripUnknown: true  // Remove unknown props
    };

    // Validate request body if schema.body is provided
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, validationOptions);
      
      if (error) {
        const message = error.details.map(detail => detail.message).join(', ');
        return next(new ApiError(message, 400));
      }
      
      req.body = value;
    }

    // Validate URL params if schema.params is provided
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, validationOptions);
      
      if (error) {
        const message = error.details.map(detail => detail.message).join(', ');
        return next(new ApiError(message, 400));
      }
      
      req.params = value;
    }

    // Validate query string if schema.query is provided
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, validationOptions);
      
      if (error) {
        const message = error.details.map(detail => detail.message).join(', ');
        return next(new ApiError(message, 400));
      }
      
      req.query = value;
    }

    next();
  };
};

module.exports = {
  validate
};