export interface ESocialBaseConferInssValues {
  cpfNumber: string;
  name: string;
  lotationCode: string;
  esocialCategory: string;
  esocialRegistration: string;
  branchId: string;
  inssValue: number;
  inssTafValue: number;
  inssRetValue: number;
  inssRetGrossValue?: number;
  inss13Value: number;
  inss13TafValue: number;
  inss13RetValue: number;
  inss13RetGrossValue?: number;
  inssBasis: number;
  inssTafBasis: number;
  inssRetBasis: number;
  inssRetSuspJudBasis?: number;
  inssRetTotalBasis?: number;
  familySalaryValue: number;
  familySalaryTafValue: number;
  familySalaryRetValue: number;
  maternitySalaryValue: number;
  maternitySalaryTafValue: number;
  maternitySalaryRetValue: number;
  inss13Basis: number;
  inss13TafBasis: number;
  inss13RetBasis: number;
  maternitySalary13Value: number;
  maternitySalary13TafRetValue: number;
  maternitySalary13RetValue: number;
  inconsistent: boolean;
}
