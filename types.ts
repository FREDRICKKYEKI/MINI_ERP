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
