export interface LeaseOverdueActionState {
  error?: string;
  errorDetails?: string[];
  message?: string;
}

export const initialLeaseOverdueActionState: LeaseOverdueActionState = {};
