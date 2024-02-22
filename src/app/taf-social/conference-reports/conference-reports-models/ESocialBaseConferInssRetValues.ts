export interface ESocialBaseConferInssRetValues<P, T> {
  cpfNumber: string;
  name: string;
  inssGrossValue: P;
  inssTafGrossValue: P;
  inssRetGrossValue: P;
  inssRetDescGrossValue: P;
  inss13GrossValue: P;
  inss13TafGrossValue: P;
  inss13RetGrossValue: P;
  inss13DescGrossValue: P;
  familySalaryValue: P;
  familySalaryTafValue: P;
  familySalaryRetValue: P;
  maternitySalaryValue: P;
  maternitySalaryTafValue: P;
  maternitySalaryRetValue: P;
  maternitySalary13Value: P;
  maternitySalary13TafRetValue: P;
  maternitySalary13RetValue: P;
  divergent: T;
}
