export interface TsiIntegrationErrorsRequest {
  companyId: string;
  branchCode: string;
  dateOf: string;
  dateUp: string;
  typeFilter: string;
  page?:number;
  pageSize?:number;
}

