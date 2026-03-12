const logger = require('../utils/logger');

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    // Always log the error
    logger.error(`${err.name}: ${err.message}`, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        user: req.user ? req.user.id : 'Guest'
    });

    // Default response status and msg
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
    } else if (err.code === 11000) { // MongoDB duplicate key
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Include stack trace only in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
