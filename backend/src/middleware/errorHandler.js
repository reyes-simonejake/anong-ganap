/**
 * Central error handling middleware.
 * Catches errors thrown from route handlers and returns a consistent JSON shape.
 */
export const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(
        `[${new Date().toISOString()}] ${req.method} ${req.path} — ${status}: ${message}`
    );
    if (process.env.NODE_ENV === 'development' && err.stack) {
        console.error(err.stack);
    }

    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * 404 handler — place before errorHandler in server.js
 */
export const notFound = (req, res, next) => {
    const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
};
