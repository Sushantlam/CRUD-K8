import { NextFunction, Request, Response } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

export { asyncHandler, errorHandler, notFound };
