import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { loginUser, registerUser, rotateRefreshToken } from './auth.service.js';
import { z } from 'zod';

const RegisterDto = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
const LoginDto = z.object({ email: z.string().email(), password: z.string().min(6) });

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = RegisterDto.parse(req.body);
  const user = await registerUser(name, email, password);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = LoginDto.parse(req.body);
  const result = await loginUser(email, password);
  res.json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = z.object({ refreshToken: z.string().min(10) }).parse(req.body);
  const data = await rotateRefreshToken(refreshToken);
  res.json(data);
});
