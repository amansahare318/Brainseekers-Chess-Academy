import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: {
    status?: number;
    statusCode?: number;
    message?: string;
    code?: number;
    name?: string;
    errors?: Record<string, { message: string }>;
  },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message || 'Validation error' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry' });
  }

  const status = err.status ?? err.statusCode ?? 500;
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message ?? 'Internal Server Error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
};
