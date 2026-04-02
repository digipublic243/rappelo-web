export interface PaymentWorkflowActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
  linkUrl?: string;
  gatewayUrl?: string;
  gatewayReference?: string;
  expiresAt?: string;
  paymentId?: string;
}

export const initialPaymentWorkflowActionState: PaymentWorkflowActionState = {};
