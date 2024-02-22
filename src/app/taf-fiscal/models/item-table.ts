export interface ItemTable {
  branch: string;
  branchTaxNumber?: string;
  taxNumber: string;
  company: string;
  taxNumberFormated: string;
  totalInvoice: number;
  totalTaxBase: number;
  totalGrossValue: number;
  totalTaxes: number;
  status: string;
  key: string;
  errorId?: string;
  protocol?: string;
}
