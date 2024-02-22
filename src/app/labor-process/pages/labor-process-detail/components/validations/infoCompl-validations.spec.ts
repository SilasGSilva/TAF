import { OptionsAnswer, TypeContract } from '../../../../../models/labor-process.model';
import { InfoComplValidations } from './infoCompl-validations';

describe(InfoComplValidations.name, () => {
  describe(InfoComplValidations.isDisabledInfoCompl.name, () => {
    it('should return TRUE when indContr is NOT No', () => {
      const result = InfoComplValidations.isDisabledInfoCompl(OptionsAnswer.Yes);

      expect(result).toBeTrue();
    });

    it('should return FALSE when indContr is No', () => {
      const result = InfoComplValidations.isDisabledInfoCompl(OptionsAnswer.No);

      expect(result).toBeFalse();
    });
  });

  describe(InfoComplValidations.isDisabledInfoVinc.name, () => {
    it('should return TRUE when indContr is NOT No', () => {
      const result = InfoComplValidations.isDisabledInfoVinc(OptionsAnswer.Yes, null);

      expect(result).toBeTrue();
    });

    it('should return TRUE when tpContr is TypeContract.TrabSemVinculo', () => {
      const result = InfoComplValidations.isDisabledInfoVinc(OptionsAnswer.No, TypeContract.TrabSemVinculo);

      expect(result).toBeTrue();
    });

    it('should return FALSE when indContr is No and tpContr is NOT TypeContract.TrabSemVinculo', () => {
      const result = InfoComplValidations.isDisabledInfoVinc(OptionsAnswer.No, TypeContract.TrabalhadorComVincComAlt);

      expect(result).toBeFalse();
    });
  });
});
