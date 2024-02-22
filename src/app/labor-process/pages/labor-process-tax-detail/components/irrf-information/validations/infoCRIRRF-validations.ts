import { ValidationErrors } from '@angular/forms';
import { InfoDep, TpCREnum } from '../../../../../../models/labor-process-taxes.model';

export class InfoCRIRRFValidations {
  static readonly notExistsValueInInfoDepErrorMessage = 'Deve ser um CPF cadastrado no grupo "Informações de dependentes"';

  static validateCpfDep(cpf: string, infoDep: InfoDep[]): ValidationErrors {
    if (!infoDep) {
      return null;
    }

    if (!this.existsValueInInfoDep(cpf, infoDep)) {
      return { notExistsValueInInfoDep: true };
    }
    
    return null;
  }

  private static existsValueInInfoDep(cpf: string, infoDep: InfoDep[]): boolean {
    return infoDep.some(info => info.cpfDep === cpf);
  }

  static isDisabledInfoProcRet(tpCR: TpCREnum): boolean {
    return tpCR === TpCREnum.IRRFRRA;
  }

  static isDisabledInfoRRA(tpCR: TpCREnum): boolean {
    return tpCR !== TpCREnum.IRRFRRA;
  }
}
