export interface ItemTablePayamentCreditLegalEntityBeneficiary {
  status?: string;
  branchId?: string;
  id?: string;
  providerCNPJ?: string;
  providerCode?: string;
  nif?: string;
  providerName?: string;
  totalDocs: number;
  grossAmount: number;
  incomeTaxBase: number;
  incomeTaxAmount: number;
  pisValue: number;
  cofinsValue: number;
  csllValue: number;
  agregBase: number;
  agregValue: number;
  errors?: string;
  errorId?: string;
  key?: string;
}
