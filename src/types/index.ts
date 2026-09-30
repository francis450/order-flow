export type CatalogType = 'fmcg' | 'pharma';

export type PackUnit = 'Bale' | 'Carton' | 'Dozen' | 'Box' | 'Pack' | 'Bottle' | 'Tin' | 'Sachet' | 'Piece';

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  catalogType: CatalogType;
  unit: PackUnit;
  unitPrice: number; // In KES
  packDetails: string;
  stockAvailable: number;
  taxRate: number; // 0.16 for standard 16% VAT, 0 for zero-rated flour/essentials
  aliases: string[]; // Sheng/Swahili/vernacular terms e.g. ["pembe 2kg", "unga pembe", "unga ya ugali"]
}

export interface Customer {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  location: string;
  route: string;
  taxPin: string;
  creditLimit: number; // in KES
  currentBalance: number; // Outstanding unpaid debt in KES
  aging: {
    current: number; // 0-30 days
    overdue30: number; // 31-60 days
    overdue60: number; // 61-90 days
    overdue90: number; // 90+ days
  };
  creditStatus: 'CLEAR' | 'WARN' | 'BLOCKED';
  paymentTermsDays: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

export interface ParsedLineItem {
  id: string;
  rawText: string;
  matchedSku: string;
  itemName: string;
  quantity: number;
  unit: PackUnit;
  unitPrice: number; // In KES
  lineTotal: number; // In KES
  confidence: number; // 0 to 1.0
  inStock: boolean;
  notes?: string;
}

export type OrderStatus = 'PENDING_PARSING' | 'PARSED' | 'CREDIT_HOLD' | 'APPROVED' | 'PUSHED_TO_ERP' | 'DISPATCHED';

export interface WhatsAppOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  route: string;
  rawMessage: string;
  messageType: 'text' | 'voice_note' | 'chit_image';
  audioDurationSeconds?: number;
  receivedAt: string;
  status: OrderStatus;
  catalogType: CatalogType;
  items: ParsedLineItem[];
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  deliveryDatePreference?: string;
  deliveryNotes?: string;
  creditCheckResult?: CreditCheckResult;
  erpSyncDetails?: ErpSyncDetails;
}

export interface CreditCheckResult {
  allowed: boolean;
  decision: 'APPROVED' | 'WARN' | 'BLOCKED';
  customerBalance: number;
  orderAmount: number;
  projectedBalance: number;
  creditLimit: number;
  overdueAmount: number;
  oldestInvoiceDays: number;
  recommendedAction: string;
  requiredDownpayment: number;
  reasons: string[];
}

export interface ErpSyncDetails {
  erpType: 'SAP_BUSINESS_ONE' | 'QUICKBOOKS' | 'ODOO' | 'TALLY' | 'EXCEL_BATCH';
  syncedAt: string;
  erpReferenceNumber: string;
  warehouseBay: string;
  deliveryTruckId: string;
  pickingListGenerated: boolean;
}

export interface MpesaTransaction {
  id: string;
  mpesaReceiptNo: string;
  customerName: string;
  phone: string;
  amount: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'RECONCILED';
  matchedOrderId?: string;
}
