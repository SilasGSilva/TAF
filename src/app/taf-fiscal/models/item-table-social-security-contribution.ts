export interface ItemTableSocialSecurityContribution {
  status: string;
  typeOfInscription: string;
  companyTaxNumber: string;
  taxNumberFormated: string;
  totalInvoice: number;
  totalGrossValue: number;
  sociaSecurityContributionValue: number;
  sociaSecurityContributionValueSuspended: number;
  key?: string;
  branchId?: string;
  errorId?: string;
}
