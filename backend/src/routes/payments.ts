import { Router } from 'express';
import {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getUserPayments,
  paymentCallback,
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validatePayment } from '../middleware/validation';

const router = Router();

// Protected routes
router.post('/', authenticateToken, validatePayment, createPayment);
router.get('/user', authenticateToken, getUserPayments);
router.get('/verify/:transactionId', verifyPayment);
router.get('/status/:transactionId', getPaymentStatus);

// Webhook route (no auth required for FedaPay callbacks)
router.post('/callback', paymentCallback);

export default router;
