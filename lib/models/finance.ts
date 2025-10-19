// Financial domain models for AP/AR, Cash, FP&A, Accounting, Taxes, Risk, Legal

export type UUID = string;

// Cost Centers
export interface CostCenter {
  id: UUID;
  code: string;
  name: string;
  parentId?: UUID | null;
  createdAt: string;
  updatedAt: string;
}

// Ledger & Accounts
export type LedgerAccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface LedgerAccount {
  id: UUID;
  code: string;
  name: string;
  type: LedgerAccountType;
  createdAt: string;
}

export interface LedgerEntry {
  id: UUID;
  date: string; // ISO Date
  description?: string;
  debitAccountId: UUID;
  creditAccountId: UUID;
  amount: number;
  costCenterId?: UUID | null;
  externalRef?: string;
  createdAt: string;
}

// DRE
export interface DREPeriod {
  id: UUID;
  periodStart: string; // ISO Date
  periodEnd: string;   // ISO Date
  createdAt: string;
}

export interface DRELine {
  id: UUID;
  drePeriodId: UUID;
  lineCode: string;
  lineName: string;
  amount: number;
  createdAt: string;
}

// Taxes
export type TaxCode = 'ICMS' | 'ISS' | 'IR' | 'PIS' | 'COFINS';

export interface TaxRate {
  id: UUID;
  taxCode: TaxCode | string;
  jurisdiction?: string;
  rate: number;
  validFrom: string; // ISO Date
  validTo?: string | null; // ISO Date
  createdAt: string;
}

export type TaxApuracaoStatus = 'pending' | 'approved' | 'paid';

export interface TaxApuracao {
  id: UUID;
  taxCode: TaxCode | string;
  periodStart: string;
  periodEnd: string;
  baseAmount: number;
  calculatedTax: number;
  status: TaxApuracaoStatus;
  createdAt: string;
}

// Cash Management
export interface CashPosition {
  id: UUID;
  accountName: string;
  bank?: string;
  balance: number;
  asOfDate: string; // ISO Date
  createdAt: string;
}

export interface CashFlowProjection {
  id: UUID;
  date: string; // ISO Date
  description?: string;
  inflow: number;
  outflow: number;
  predicted: boolean;
  modelVersion?: string;
  createdAt: string;
}

// Budgets (FP&A)
export interface Budget {
  id: UUID;
  year: number;
  month?: number;
  costCenterId?: UUID | null;
  lineItem: string;
  plannedAmount: number;
  createdAt: string;
}

// Risk & Economic Intelligence
export type RiskEntityType = 'customer' | 'supplier';

export interface RiskScore {
  id: UUID;
  entityType: RiskEntityType;
  entityId: string;
  score: number;
  model?: string;
  asOfDate: string;
  createdAt: string;
}

export interface EconomicForecast {
  id: UUID;
  variable: string; // inflation, interest, fx
  horizonMonths: number;
  forecastValue: number;
  model?: string;
  asOfDate: string;
  createdAt: string;
}

// Legal & Compliance
export type LegalDocumentStatus = 'draft' | 'active' | 'expired';

export interface LegalDocument {
  id: UUID;
  docType: string;
  title: string;
  status: LegalDocumentStatus;
  dueDate?: string;
  createdAt: string;
}

export type ComplianceSeverity = 'low' | 'medium' | 'high';

export interface ComplianceAlert {
  id: UUID;
  category: string; // tax, labor, contract
  message: string;
  severity: ComplianceSeverity;
  dueDate?: string;
  resolved: boolean;
  createdAt: string;
}