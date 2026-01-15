import { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../../middleware/responseFormate';
import catchAsync from '../../utils/catchAsync';
import {
  loginUserService,
  registerUserService,
} from './auth.service';

export const registerUser = catchAsync(
  async (req, res) => {
    const data = await registerUserService(req.body);
    generateResponse(res, 201, true, 'Registered successfully!', data);
  }
);

export const loginUser = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await loginUserService({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    generateResponse(res, 200, true, 'Login successful', {
      accessToken,
      refreshToken,
      user,
    });
});

