import { TpProcRetEnum, TpProcRetLabelEnum } from '../../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Tipo de processo',
    property: 'tpProcRetLabel',
  },
  {
    label: 'Número do processo administrativo/judicial',
    property: 'nrProcRetLabel',
  },
  {
    label: 'Código do indicativo da suspensão',
    property: 'codSuspLabel',
  },
];

export const OPTIONS_TP_PROC_RET = [
  {
    label: TpProcRetLabelEnum.administrativo,
    value: TpProcRetEnum.administrativo,
  },
  {
    label: TpProcRetLabelEnum.judicial,
    value: TpProcRetEnum.judicial,
  },
];
