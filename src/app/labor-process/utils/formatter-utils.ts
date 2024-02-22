type EnumValue = string | number;
type EnumType = Record<string, EnumValue>;

export class FormatterUtils {
  static formatCpf(cpf: string): string {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return cpf;
  }

  static formatCnpj(cnpj: string): string {
    cnpj = cnpj.replace(/\D/g, '');
    cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return cnpj;
  }

  static formatCpfOrCnpj(identification: string, isCpf: boolean) {
    const formatter = isCpf ? this.formatCpf : this.formatCnpj;

    return formatter(identification);
  }

  /**
   * Realiza a conversão entre enums que seguem o padrão "value <-> valueEnum <-> valueLabelEnum",
   * permitindo a conversão direta de um "value" para seu correspondente no "valueLabelEnum".
   * 
   * @param value O valor armazenado dentro do enum que você deseja converter.
   * @param ValueEnum O enum do tipo "value <-> valueEnum" que contém as correspondências de valores.
   * @param ValueLabelEnum O enum do tipo "valueEnum <-> valueLabelEnum" que contém as etiquetas associadas.
   * 
   * @returns A string armazenada no enum ValueLabelEnum que corresponde ao valor fornecido.
   */
  static convertValueToLabel<T extends EnumType>(
    value: EnumValue,
    ValueEnum: T,
    ValueLabelEnum: Record<keyof T, string>
  ): string {
    let valueEnumLabel;
    if(typeof value === 'number')
      valueEnumLabel = ValueEnum[value];
    else
      valueEnumLabel = this.getEnumKeyByEnumValue(ValueEnum, value);

    return ValueLabelEnum[valueEnumLabel] || '';
  }

  static getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
}
