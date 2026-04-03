export interface LandlordEasyPayActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
  easypayStatus?: string;
}

export const initialLandlordEasyPayActionState: LandlordEasyPayActionState = {};
