import { FormatterUtils } from './formatter-utils';

describe(FormatterUtils.name, () => {
  describe(FormatterUtils.formatCpf.name, () => {
    it('should format correctly a cpf', () => {
      const result = FormatterUtils.formatCpf('01234567890');

      expect(result).toEqual('012.345.678-90');
    });
  });

  describe(FormatterUtils.formatCnpj.name, () => {
    it('should format correctly a cnpj', () => {
      const result = FormatterUtils.formatCnpj('01234567890123');

      expect(result).toEqual('01.234.567/8901-23');
    });
  });

  describe(FormatterUtils.formatCpfOrCnpj.name, () => {
    it('should call formatCpf when given a cpf', () => {
      spyOn(FormatterUtils, 'formatCpf');

      FormatterUtils.formatCpfOrCnpj('01234567890', true);

      expect(FormatterUtils.formatCpf).toHaveBeenCalled();
    });

    it('should call formatCnpj when given a cnpj', () => {
      spyOn(FormatterUtils, 'formatCnpj');

      FormatterUtils.formatCpfOrCnpj('01234567890123', false);

      expect(FormatterUtils.formatCnpj).toHaveBeenCalled();
    });
  });

  describe(FormatterUtils.convertValueToLabel.name, () => {
    enum ValueEnum {
      value = 1,
    };
    enum ValueLabelEnum {
      value = 'valueLabel',
    };

    it('should return the correct label from a value', () => {
      const result = FormatterUtils.convertValueToLabel(ValueEnum.value, ValueEnum, ValueLabelEnum);

      expect(result).toEqual(ValueLabelEnum.value);
    });

    it('should return "" when value NOT exist in Enum', () => {
      const result = FormatterUtils.convertValueToLabel(42, ValueEnum, ValueLabelEnum);

      expect(result).toEqual('');
    });
  });
});
