export interface membershipPlanType {
  name: string;
  price: number;
  includes: string[];
}

export interface TransactionType {
  id: string;
  user_id: number;
  amount: number;
  transaction_type: "subscription" | "contribution";
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
}
