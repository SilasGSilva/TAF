export interface ESocialBaseConferRetValuesRequest {
  companyId: string;
  requestId: string;
  synthetic: boolean;
  level?: string;
  cpfNumber?: string;
  demonstrativeId?: string;
  differencesOnly?: boolean;
  warningsOnly?: boolean;
  page?: number;
  pageSize?: number;
}
