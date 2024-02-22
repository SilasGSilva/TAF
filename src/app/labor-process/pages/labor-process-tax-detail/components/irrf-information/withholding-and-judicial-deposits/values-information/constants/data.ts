import { IndApuracaoEnum, IndApuracaoLabelEnum } from '../../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Indicativo de período de apuração',
    property: 'indApuracaoLabel',
  },
  {
    label: 'Retenção que deixou de ser efetuada',
    property: 'vlrNRetidoLabel',
    type: 'currency',
    format: 'BRL',
  },
  {
    label: 'Depósito judicial',
    property: 'vlrDepJudLabel',
    type: 'currency',
    format: 'BRL',
  },
  {
    label: 'Compensação relativa ao ano calendário',
    property: 'vlrCmpAnoCalLabel',
    type: 'currency',
    format: 'BRL',
  },
  {
    label: 'Compensação relativa a anos anteriores',
    property: 'vlrCmpAnoAntLabel',
    type: 'currency',
    format: 'BRL',
  },
  {
    label: 'Rendimento com exigibilidade suspensa',
    property: 'vlrRendSuspLabel',
    type: 'currency',
    format: 'BRL',
  },
];

export const OPTIONS_IND_APURACAO = [
  {
    label: IndApuracaoLabelEnum.mensal,
    value: IndApuracaoEnum.mensal,
  },
  {
    label: IndApuracaoLabelEnum.anual,
    value: IndApuracaoEnum.anual,
  },
];
