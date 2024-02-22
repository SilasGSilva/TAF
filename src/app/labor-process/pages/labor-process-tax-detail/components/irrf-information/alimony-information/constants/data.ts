import { TpRendEnum, TpRendLabelEnum } from '../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'CPF do dependente/beneficiário da pensão alimentícia',
    property: 'cpfDepLabel',
  },
  {
    label: 'Tipo de rendimento',
    property: 'tpRendLabel',
  },
  {
    label: 'Valor relativo à dedução do rendimento tributável correspondente a pagamento de pensão alimentícia',
    property: 'vlrPensaoLabel',
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
  {
    label: TpRendLabelEnum.rra,
    value: TpRendEnum.rra,
  },
  {
    label: TpRendLabelEnum.rendIsenNTrib,
    value: TpRendEnum.rendIsenNTrib,
  },
];
