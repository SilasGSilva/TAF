export interface ItemTablePayamentCreditPhysicalBeneficiary {
  status?: string;
  branchId?: string;
  id?: string;
  providerCPF?: string;
  providerCode?: string;
  nif?: string;
  providerName?: string;
  totalDocs: number;
  grossAmount: number;
  incomeTaxAmount: number;
  incomeTaxBase: number;
  errors?: string;
  errorId?: string;
  key?: string;
}
