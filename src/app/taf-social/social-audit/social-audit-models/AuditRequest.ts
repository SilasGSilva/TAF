export interface AuditExecuteRequest {
    companyId: string;
    branches: Array<string>;
    period: string;
    eventCodes: Array<string>;
    status: string;
    deadline: string;
    periodFrom: string;
    periodTo: string;
}
