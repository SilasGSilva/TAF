export class ESocialBaseConferValuesRequest {
    public companyId: string;
    public requestId: string;
    public synthetic: boolean;
    public differencesOnly?: boolean;
    public warningsOnly?: boolean;
    public cpfNumber?: Array<string> | string;
    public eSocialCategory?: Array<string>;
    public eSocialRegistration?: Array<string> | string;
    public demonstrativeId?: Array<string> | string;
    public lotationCode?: Array<string>;
    public registrationNumber?: Array<string>;
    public page?: number;
    public pageSize?: number;
}
