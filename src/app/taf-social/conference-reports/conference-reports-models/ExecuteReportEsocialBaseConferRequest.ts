export interface ExecuteReportEsocialBaseConferRequest {
  companyId: string;
  cpfNumber?: Array<string> | string;
  eSocialCategory?: Array<string>;
  eSocialRegistration?: Array<string> | string;
  lotationCode?: Array<string>;
  paymentPeriod: string;
  registrationNumber?: Array<string>;
  tribute: string;
  differencesOnly: boolean;
  warningsOnly?: boolean;
  numberOfLines?: number;
}
