export interface Invoice {
  id: string;
  customerName?: string;
  storeName?: string;
  campId?: string;
  campName?: string;
  salesValue?: number;
  campValue?: number;
  overhead?: number;
  label?: number;
  serialNumber?: number;
  dateCreated?: any;
  invoiceId: string;
  createdBy: string;
  updatedBy: string;
  updatedAt?: any;
  customerId: string;
  customerUniqueId: string;
  amount?: number;
}
