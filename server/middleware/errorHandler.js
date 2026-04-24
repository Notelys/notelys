// Global error handler middleware
// Must have 4 parameters for Express to recognize it as an error handler
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.path}:`, err.message);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({ 
        error: err.message || "Internal server error" 
    });
};

export default errorHandler;
