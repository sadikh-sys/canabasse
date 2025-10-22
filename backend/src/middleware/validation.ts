import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest, PaymentRequest } from '../types';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password }: RegisterRequest = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  next();
};

export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  const { amount, paymentMethod }: PaymentRequest = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required',
    });
  }

  const validPaymentMethods = ['orange_money', 'wave', 'free_money', 'visa'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Valid payment method is required',
    });
  }

  next();
};

export const validateTrackId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const trackId = parseInt(id);

  if (isNaN(trackId) || trackId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid track ID is required',
    });
  }

  req.params.id = trackId.toString();
  next();
};
