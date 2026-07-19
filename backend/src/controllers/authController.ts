import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as jwt.SignOptions);
};

const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are all required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user,
    token: generateToken(user._id.toString()),
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  const userWithPasswordMethod = user as typeof user & { comparePassword: (candidate: string) => Promise<boolean> };
  if (!userWithPasswordMethod || !(await userWithPasswordMethod.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!userWithPasswordMethod) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: userWithPasswordMethod,
    token: generateToken(userWithPasswordMethod._id.toString()),
  });
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ user });
});

export { register, login, getMe };
