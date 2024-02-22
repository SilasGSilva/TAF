export interface AuditValuesRequest {
  companyId: string;
  requestId: string;
  page?: number;
  pageSize?: number;
  status?: string;
}
