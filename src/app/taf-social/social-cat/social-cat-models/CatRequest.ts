export interface CatExecuteRequest {
    companyId: string;
    branches: Array<string>;
    cpf: string;
    catNumber: string;
    name: string;
    periodFrom: string;
    periodTo: string;
}
