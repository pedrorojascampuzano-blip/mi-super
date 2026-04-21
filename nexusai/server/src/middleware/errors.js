// Global error handler - catches unhandled async errors
export function errorHandler(err, req, res, _next) {
  console.error(`[${req.method} ${req.path}]`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

// Wrapper for async route handlers
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
