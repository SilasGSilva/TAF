import { Range } from 'xlsx';

export interface TributeReport {
  fileName: string;
  synthetic?: boolean;
  tribute: {
    type: string;
    fgts?: {
      resultBasis: unknown[];
      resultDeposits: unknown[];
    };
    inss?: {
      dataValues: Array<string | number>;
      mergedCells: Range[];
    };
    irrf?: {
      dataValues: Array<string | number>;
      dataValuesAgglutinated: Array<string | number>;
      mergedCells: Range[];
    };
  };
}
