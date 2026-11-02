export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceVersion {
  version: string;
  timestamp: string;
  note: string;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  status: "DRAFT" | "PENDING" | "PAID";
  issueDate: string;
  dueDate: string;
  currency: "USD" | "INR" | "EUR" | "GBP";
  sender: {
    name: string;
    email: string;
    address: string;
    country: string;
    taxId: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
    country: string;
    taxId: string;
  };
  items: LineItem[];
  discount: number;
  notes: string;
}