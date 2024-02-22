export interface EsocialDetailsFilter {
  companyCode: string;
  companyId: string;
  branches: Array<string>;
  id: string;
  eventCode: string;
  period: string;
  periodFrom: string;
  periodTo: string;
  motiveCode?: Array<string>;
  status: string | Array<string>;
  userId: string;
  keys?: Array<string>;
  genericFilter?: string;
  periodFilter?: string;
  page?: number;
  pageSize?: number;
}
