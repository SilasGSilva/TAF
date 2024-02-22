export interface ItemTableSpecificEvent {
  typeOfInscription: string;
  taxNumberFormated: string;
  taxNumber: string;
  beginingDate: string;
  finishingdate: string;
  taxClassification: string;
  isMandatoryBookkeeping: string;
  isPayrollExemption: string;
  hasFineExemptionAgreement: string;
  contact: string;
  contactTaxNumber: string;
  contactTaxNumberFormated: string;
  status: string;
  branch: string;
  key?: string;
  errorId?: string;
  protocol?: string;
  errors?: string;
  keyValidationErrors?: string;
}
