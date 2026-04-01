export interface PaymentWorkflowActionState {
  error?: string;
  message?: string;
  linkUrl?: string;
}

export const initialPaymentWorkflowActionState: PaymentWorkflowActionState = {};
