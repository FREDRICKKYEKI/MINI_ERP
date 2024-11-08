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
