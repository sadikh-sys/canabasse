import axios from 'axios';
import { PaymentRequest, FedaPayConfig } from '../types';

class FedaPayService {
  private config: FedaPayConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: process.env.FEDAPAY_API_KEY!,
      environment: (process.env.FEDAPAY_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
    };

    this.baseUrl = this.config.environment === 'live' 
      ? 'https://api.fedapay.com/v1' 
      : 'https://api-sandbox.fedapay.com/v1';
  }

  /**
   * Create a payment transaction
   */
  async createPayment(paymentData: PaymentRequest & { customerId: number }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          amount: paymentData.amount * 100, // Convert to cents
          currency: 'XOF',
          description: `Payment for music track - User ${paymentData.customerId}`,
          callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
          customer: {
            id: paymentData.customerId,
          },
          payment_method: paymentData.paymentMethod,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('FedaPay payment creation error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Payment creation failed' 
      };
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('FedaPay payment verification error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Payment verification failed' 
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      );

      const transaction = response.data.data;
      return {
        success: true,
        status: transaction.status,
        data: transaction,
      };
    } catch (error: any) {
      console.error('FedaPay status check error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Status check failed' 
      };
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(customerData: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/customers`,
        customerData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('FedaPay customer creation error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Customer creation failed' 
      };
    }
  }
}

export default new FedaPayService();
