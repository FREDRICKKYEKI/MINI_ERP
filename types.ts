/**
 * @description: This file contains all the types used in the application ``FOR BACKEND``
 */
export type tokenType = {
  token: string;
  expiryDate: string;
  error: string | null;
  status: number;
  message: string;
  // Added during runtime
  createdAt: Date;
};

export interface IPNRegResponseType {
  url: string;
  created_date: string;
  ipn_id: string;
  notification_type: number;
  ipn_notification_type_description: "GET" | "POST";
  ipn_status: number;
  ipn_status_decription: string;
  status: string;
  message: string;
  token?: string;
}

export interface SubmitOrderResponseType {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: string | null;
  status: string;
}

export interface SignUpRequestType {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  role: string;
}

export interface ValidationReturnType {
  message: string;
  error: boolean;
}
export interface SubmitOrderCallbackResponseType {
  OrderNotificationType: string;
  OrderTrackingId: string;
  OrderMerchantReference: string;
}

export interface TransactionStatusResponseType {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: {
    error_type: string | null;
    code: string | null;
    message: string | null;
    call_back_url: string | null;
  };
  status: string;
}

export interface parsedOrderMerchantReferenceType {
  transaction_type: "subscription" | "contribution";
  amount: string;
  user_id: string;
  unique_id: string;
  sub_type?: "Free" | "Pro" | "Enterprise";
  purpose?: string;
}
