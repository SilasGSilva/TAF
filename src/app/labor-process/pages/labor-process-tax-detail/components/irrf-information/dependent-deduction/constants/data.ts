import { TpRendEnum, TpRendLabelEnum } from '../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'CPF do dependente',
    property: 'cpfDepLabel',
  },
  {
    label: 'Tipo de rendimento',
    property: 'tpRendLabel',
  },
  {
    label: 'Valor da dedução da base de cálculo',
    property: 'vlrDeducaoLabel',
    type: 'currency',
    format: 'BRL'
  },
];

export const OPTIONS_TP_REND = [
  {
    label: TpRendLabelEnum.remunMensal,
    value: TpRendEnum.remunMensal,
  },
  {
    label: TpRendLabelEnum.salario13,
    value: TpRendEnum.salario13,
  },
];
