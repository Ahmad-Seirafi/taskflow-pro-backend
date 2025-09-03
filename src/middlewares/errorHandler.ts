import type { Request, Response, NextFunction } from 'express';

/** Unified JSON error response */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details;
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Error:', { status, message, details });
  }
  res.status(status).json({ error: message, details });
}
