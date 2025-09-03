import type { RequestHandler } from 'express';

/** Wrap async controllers and forward errors to Express error handler */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
