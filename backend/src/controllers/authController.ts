import { Request, Response } from 'express';
import { RegisterRequest, LoginRequest, AuthUser } from '../types';
import databaseService from '../services/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import fedaPayService from '../services/fedapay';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone }: RegisterRequest = req.body;

    const existingUser = await databaseService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await databaseService.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const fedapayCustomer = await fedaPayService.createCustomer({
      firstname: name.split(' ')[0] || name,
      lastname: name.split(' ').slice(1).join(' ') || '',
      email,
      phone,
    });

    if (!fedapayCustomer.success) {
      console.warn('Failed to create FedaPay customer:', fedapayCustomer.error);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: authUser, token },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    const user = await databaseService.findUserByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken({ userId: user.id, email: user.email });

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ success: true, message: 'Login successful', data: { user: authUser, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};
