export interface ESocialBaseConferInssTableItems {
  branchId: string;
  lotationCode: string;
  esocialCategory: string;
  esocialRegistration: string;
  detail: Array<{
    inssLabel: string;
    inssValue: string;
    inssTafValue: string;
    inssRetValue: string;
  }>;
}
