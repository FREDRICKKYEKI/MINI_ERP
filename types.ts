export type tokenType = {
  token: string;
  expiryDate: string;
  error: string | null;
  status: number;
  message: string;
  // Added during runtime
  createdAt: Date;
};
