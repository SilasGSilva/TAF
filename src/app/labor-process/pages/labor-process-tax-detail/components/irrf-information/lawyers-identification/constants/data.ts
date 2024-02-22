import { TpInscLabelEnum, TpInscEnum } from '../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Tipo de inscrição',
    property: 'tpInscLabel',
  },
  {
    label: 'Número de inscrição do advogado',
    property: 'nrInscLabel',
  },
  {
    label: 'Valor da despesa com o advogado',
    property: 'vlrAdvLabel',
    type: 'currency',
    format: 'BRL'
  },
];

export const OPTIONS_TP_INSC = [
  {
    label: TpInscLabelEnum.cnpj,
    value: TpInscEnum.cnpj,
  },
  {
    label: TpInscLabelEnum.cpf,
    value: TpInscEnum.cpf,
  },
];
