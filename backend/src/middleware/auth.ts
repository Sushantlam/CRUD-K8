import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}

const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

export { protect };
