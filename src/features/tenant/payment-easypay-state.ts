export interface TenantEasyPayActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
  gatewayReference?: string;
  lastPhoneNumber?: string;
  easypayStatus?: string;
}

export const initialTenantEasyPayActionState: TenantEasyPayActionState = {};
