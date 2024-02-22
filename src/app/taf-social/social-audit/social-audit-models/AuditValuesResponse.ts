import { Audit } from "./Audit";

export interface AuditValuesResponse {
    items: Array<Audit>;
    hasNext: boolean;
}

