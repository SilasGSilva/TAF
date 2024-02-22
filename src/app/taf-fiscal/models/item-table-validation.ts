export interface ItemTableValidation {
  branch: string;
  key: string;
  branchId?: string;
  branchTaxNumber?: string;
  taxNumber: string;
  company: string;
  taxNumberFormated: string;
  totalInvoice: number;
  totalTaxBase: number;
  totalGrossValue: number;
  totalTaxes: number;
  status: string;
  errors: string;
  keyValidationErrors?: string;
}
