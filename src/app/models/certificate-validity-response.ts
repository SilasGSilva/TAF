export interface CertificateValidityResponse {
  issuer: string;
  version: string;
  subject: string;
  certificateType: string;
  validFrom: string;
  validTo: string;
}
