export interface ItemTableMonitor {
  taxNumberFormated: string;
  company: string;
  totalGrossValue: number;
  totalTaxes: number;
  totalTaxBase: number;
  errors: string;
  errorId?: string;
  protocol?: string;
}
