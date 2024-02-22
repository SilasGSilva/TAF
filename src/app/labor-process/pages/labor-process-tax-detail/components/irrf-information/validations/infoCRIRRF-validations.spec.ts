import { InfoDep, TpCREnum } from '../../../../../../models/labor-process-taxes.model';
import { InfoCRIRRFValidations } from './infoCRIRRF-validations';

describe(InfoCRIRRFValidations.name, () => {
  it('should have a static property "notExistsValueInInfoDepErrorMessage"', () => {
    expect(InfoCRIRRFValidations.notExistsValueInInfoDepErrorMessage).toBe('Deve ser um CPF cadastrado no grupo "Informações de dependentes"');
  });

  describe(InfoCRIRRFValidations.validateCpfDep.name, () => {
    it('should return NULL when infoDep is NULL', () => {
      const result = InfoCRIRRFValidations.validateCpfDep('123456789', null);

      expect(result).toBeNull();
    });

    it('should return NULL when cpf exists in infoDep', () => {
      const infoDep = [{ cpfDep: '123456789' }, { cpfDep: '987654321' }] as InfoDep[];

      const result = InfoCRIRRFValidations.validateCpfDep(infoDep[0].cpfDep, infoDep);

      expect(result).toBeNull();
    });

    it('should return a ValidationErrors object when cpf does NOT exist in infoDep', () => {
      const infoDep = [{ cpfDep: '987654321' }, { cpfDep: '555555555' }] as InfoDep[];

      const result = InfoCRIRRFValidations.validateCpfDep('123456789', infoDep);

      expect(result).toEqual({ notExistsValueInInfoDep: true });
    });
  });

  describe(InfoCRIRRFValidations.isDisabledInfoProcRet.name, () => {
    it('should return TRUE when tpCR is TpCREnum.IRRFRRA', () => {
      const result = InfoCRIRRFValidations.isDisabledInfoProcRet(TpCREnum.IRRFRRA);

      expect(result).toBeTrue();
    });

    it('should return FALSE when tpCR is NOT TpCREnum.IRRFRRA', () => {
      const result = InfoCRIRRFValidations.isDisabledInfoProcRet(TpCREnum.IRRFDecisaoJustica);

      expect(result).toBeFalse();
    });
  });
});
