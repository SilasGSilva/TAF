export interface ItemTableEventByTheSportsAssociation {
  status?: string;
  branch: string;
  newsletterNumber: string;
  mode: string;
  competition: string;
  taxNumberPrincipal: string;
  taxNumberVisited: string;
  payingOffValue: number;
  dontPayingOffValue: number;
  grossValue: number;
  contributionValue: number;
  contributionValueSuspended: number;
  key?: string;
  errors: string;
  keyValidationErrors?: string;
  branchId?: string;
  errorId?: string;
}
