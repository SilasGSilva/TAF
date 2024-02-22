import { IRAnalyticalInfo } from "./IRAnalyticalInfo";

export interface IRValueTypes {
  taxableIncome?: IRAnalyticalInfo;
  nonTaxableIncome?: IRAnalyticalInfo;
  retention?: IRAnalyticalInfo; 
  deductions?: IRAnalyticalInfo; 
  taxableIncomeSuspended?: IRAnalyticalInfo;
  retentionSuspended?: IRAnalyticalInfo;
  deductionsSuspended?: IRAnalyticalInfo;
  judicialCompensation?: IRAnalyticalInfo;
}