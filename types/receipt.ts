export type TransType = "PURCHASE" | "SALES" | "TRANSFER";

export interface Receipt {
  id: string;
  serialNo: string;
  docketDate: string;
  vehicleNo: string;
  partner: string | null;
  driverName: string | null;
  driverIc: string | null;
  doNo: string | null;
  poNo: string | null;
  transType: TransType;
  transporter: string | null;
  product: string;
  timeIn: string;
  timeOut: string | null;
  firstWeight: number;
  secondWeight: number;
  nettWeight: number;
  unitPrice: number;
  amount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  remarks: string | null;
  weighingBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptFormValues {
  vehicleNo: string;
  partner: string;
  driverName: string;
  driverIc: string;
  doNo: string;
  poNo: string;
  transType: TransType;
  transporter: string;
  product: string;
  docketDate: string; // yyyy-mm-dd
  timeIn: string; // yyyy-mm-ddTHH:mm
  timeOut: string; // yyyy-mm-ddTHH:mm
  firstWeight: string;
  secondWeight: string;
  unitPrice: string;
  gstRate: string;
  remarks: string;
  weighingBy: string;
}

export interface ReceiptListResponse {
  data: Receipt[];
  total: number;
  page: number;
  pageSize: number;
}
