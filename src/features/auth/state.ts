export interface AuthActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
  phoneNumber?: string;
  step?: "request" | "verify";
  linkUrl?: string;
}

export const initialAuthActionState: AuthActionState = {};
