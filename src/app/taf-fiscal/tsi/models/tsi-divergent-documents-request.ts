export interface TsiDivergentDocumentsRequest {
  companyId: string;
  branchCode: string;
  dateOf: string;
  dateUp: string;
  page?:number;
  pageSize?:number;
}
