export interface CatValuesRequest {
    companyId: string;
    requestId: string;
    page?: number;
    pageSize?: number;
    status?: string;
    sequencial?: Array<string>;
}
