export interface EsocialMonitorTransmissionRequest {
  branches: Array<string>;
  period?: string;
  companyId: string;
  events: Array<string>;
  motiveCode?: Array<string>;
  keys: Array<string>;
  user: string;
  periodFrom?: string;
  periodTo?: string;
  sendRejected: boolean;
}
