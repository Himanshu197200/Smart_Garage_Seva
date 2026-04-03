import Logger from '../singleton/Logger';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  message: string;
}

export interface IPaymentGateway {
  processPayment(amount: number, customerId: string, orderId: string): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount: number): Promise<PaymentResult>;
  getPaymentStatus(transactionId: string): Promise<string>;
}
