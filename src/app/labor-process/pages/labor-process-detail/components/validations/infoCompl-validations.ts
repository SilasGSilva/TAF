import { InfoContr, OptionsAnswer, TypeContract } from '../../../../../models/labor-process.model';

export class InfoComplValidations {
  static isDisabledInfoCompl(indContr: InfoContr['indContr']): boolean {
    return indContr !== OptionsAnswer.No;
  }

  static isDisabledInfoVinc(indContr: InfoContr['indContr'], tpContr: InfoContr['tpContr']): boolean {
    return this.isDisabledInfoCompl(indContr) || tpContr === TypeContract.TrabSemVinculo;
  }
  
  static isDisabledInfoTerm(indContr: InfoContr['indContr'], tpContr: InfoContr['tpContr']): boolean {
    return this.isDisabledInfoCompl(indContr) || tpContr !== TypeContract.TrabSemVinculo;
  }
}
