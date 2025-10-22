import { Request, Response } from 'express';
import { AuthenticatedRequest, PaymentRequest } from '../types';
import databaseService from '../services/database';
import fedaPayService from '../services/fedapay';

export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, trackId, paymentMethod, phone }: PaymentRequest = req.body;
    const userId = req.user!.id;

    // If trackId is provided, verify track exists and get its price
    let trackPrice = amount;
    if (trackId) {
      const track = await databaseService.getTrackById(trackId);
      if (!track) {
        return res.status(404).json({
          success: false,
          message: 'Track not found',
        });
      }
      trackPrice = track.price;
    }

    // Create payment record in database
    const payment = await databaseService.createPayment({
      userId,
      amount: trackPrice,
      status: 'pending',
      transactionId: `temp_${Date.now()}_${userId}`,
      trackId,
    });

    // Create payment with FedaPay
    const fedapayResult = await fedaPayService.createPayment({
      amount: trackPrice,
      trackId,
      paymentMethod,
      phone,
      customerId: userId,
    });

    if (!fedapayResult.success) {
      // Update payment status to failed
      await databaseService.updatePaymentStatus(payment.transactionId, 'failed');
      
      return res.status(400).json({
        success: false,
        message: 'Payment creation failed',
        error: fedapayResult.error,
      });
    }

    // Update payment with FedaPay transaction ID
    const fedapayTransaction = fedapayResult.data.data;
    await databaseService.updatePaymentStatus(
      payment.transactionId,
      fedapayTransaction.id
    );

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        paymentId: payment.id,
        transactionId: fedapayTransaction.id,
        amount: trackPrice,
        status: 'pending',
        paymentUrl: fedapayTransaction.payment_url,
        trackId,
      },
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment creation failed',
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    // Verify payment with FedaPay
    const fedapayResult = await fedaPayService.verifyPayment(transactionId);
    
    if (!fedapayResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: fedapayResult.error,
      });
    }

    const transaction = fedapayResult.data.data;
    
    // Update payment status in database
    await databaseService.updatePaymentStatus(transactionId, transaction.status);

    // If payment is successful and it's for a track, grant access
    if (transaction.status === 'approved' && transaction.metadata?.trackId) {
      const trackId = parseInt(transaction.metadata.trackId);
      const userId = transaction.customer.id;
      
      // Check if user already has this track
      const existingUserTrack = await databaseService.getUserTrack(userId, trackId);
      if (!existingUserTrack) {
        await databaseService.createUserTrack(userId, trackId);
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        transactionId,
        status: transaction.status,
        amount: transaction.amount / 100, // Convert from cents
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    // Get payment status from FedaPay
    const fedapayResult = await fedaPayService.getPaymentStatus(transactionId);
    
    if (!fedapayResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to get payment status',
        error: fedapayResult.error,
      });
    }

    res.json({
      success: true,
      data: {
        transactionId,
        status: fedapayResult.status,
        amount: fedapayResult.data.amount / 100,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
    });
  }
};

export const getUserPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const payments = await databaseService.getUserPayments(userId);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};

export const paymentCallback = async (req: Request, res: Response) => {
  try {
    // This endpoint handles FedaPay webhook callbacks
    const { transaction_id, status } = req.body;

    if (!transaction_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters',
      });
    }

    // Update payment status in database
    await databaseService.updatePaymentStatus(transaction_id, status);

    // If payment is successful, grant access to track
    if (status === 'approved') {
      // Additional logic to grant track access if needed
      console.log(`Payment ${transaction_id} approved`);
    }

    res.json({
      success: true,
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Callback processing failed',
    });
  }
};
