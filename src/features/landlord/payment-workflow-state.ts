export interface PaymentWorkflowActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
  linkUrl?: string;
}

export const initialPaymentWorkflowActionState: PaymentWorkflowActionState = {};
