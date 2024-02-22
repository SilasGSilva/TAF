import { IndTpDeducaoEnum, IndTpDeducaoLabelEnum } from '../../../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Indicativo do tipo de dedução',
    property: 'indTpDeducaoLabel',
  },
  {
    label: 'Valor da dedução da base de cálculo do imposto de renda com exigibilidade suspensa',
    property: 'vlrDedSuspLabel',
    type: 'currency',
    format: 'BRL',
  },
];

export const OPTIONS_IND_TP_DEDUCAO = [
  {
    label: IndTpDeducaoLabelEnum.prevOficial,
    value: IndTpDeducaoEnum.prevOficial,
  },
  {
    label: IndTpDeducaoLabelEnum.penAlim,
    value: IndTpDeducaoEnum.penAlim,
  },
  {
    label: IndTpDeducaoLabelEnum.dep,
    value: IndTpDeducaoEnum.dep,
  },
];
