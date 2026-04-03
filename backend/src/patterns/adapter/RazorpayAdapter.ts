import { IPaymentGateway, PaymentResult } from './IPaymentGateway';
import Logger from '../singleton/Logger';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

class RazorpayAPI {
  async createOrder(params: { amount: number; currency: string; receipt: string }): Promise<RazorpayOrder> {
    return {
      id: `order_${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      status: 'created'
    };
  }

  async capturePayment(paymentId: string, amount: number): Promise<any> {
    return { id: paymentId, status: 'captured', amount };
  }

  async refund(paymentId: string, amount: number): Promise<any> {
    return { id: `refund_${Date.now()}`, payment_id: paymentId, amount, status: 'processed' };
  }

  async fetchPayment(paymentId: string): Promise<any> {
    return { id: paymentId, status: 'captured' };
  }
}

export class RazorpayAdapter implements IPaymentGateway {
  private razorpay: RazorpayAPI;

  constructor() {
    this.razorpay = new RazorpayAPI();
  }

  async processPayment(amount: number, customerId: string, orderId: string): Promise<PaymentResult> {
    try {
      Logger.getInstance().info(`Processing payment of Rs.${amount} for customer ${customerId}`);
      const order = await this.razorpay.createOrder({ amount: amount * 100, currency: 'INR', receipt: orderId });
      const payment = await this.razorpay.capturePayment(order.id, amount * 100);
      return {
        success: payment.status === 'captured',
        transactionId: payment.id,
        amount,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      Logger.getInstance().error(`Payment failed: ${error}`);
      return { success: false, transactionId: '', amount, message: `Payment failed: ${error}` };
    }
  }

  async refundPayment(transactionId: string, amount: number): Promise<PaymentResult> {
    try {
      Logger.getInstance().info(`Processing refund of Rs.${amount} for transaction ${transactionId}`);
      const refund = await this.razorpay.refund(transactionId, amount * 100);
      return {
        success: refund.status === 'processed',
        transactionId: refund.id,
        amount,
        message: 'Refund processed successfully'
      };
    } catch (error) {
      Logger.getInstance().error(`Refund failed: ${error}`);
      return { success: false, transactionId: '', amount, message: `Refund failed: ${error}` };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    try {
      const payment = await this.razorpay.fetchPayment(transactionId);
      return payment.status;
    } catch (error) {
      Logger.getInstance().error(`Failed to fetch payment status: ${error}`);
      return 'unknown';
    }
  }
}
