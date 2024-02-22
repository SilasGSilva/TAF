import { TpCREnum, TpCRInfoCRIRRFEnum, TpCRLabelEnum, TpCRLabelInfoCRIRRFEnum } from '../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Código de Receita',
    property: 'tpCRLabel',
    width: '80%',
  },
  {
    label: 'Valor',
    property: 'vrCRLabel',
    width: '20%',
    type: 'currency',
    format: 'BRL',
  },
];

export const OPTIONS_TP_CR_V1 = [
  {
    label: TpCRLabelEnum.IRRFDecisaoJustica,
    value: TpCREnum.IRRFDecisaoJustica,
  },
  {
    label: TpCRLabelEnum.IRRFRRA,
    value: TpCREnum.IRRFRRA,
  }
];

export const OPTIONS_TP_CR = [
  {
    label: TpCRLabelInfoCRIRRFEnum.IRRFDecisaoJustica,
    value: TpCRInfoCRIRRFEnum.IRRFDecisaoJustica,
  },
  {
    label: TpCRLabelInfoCRIRRFEnum.IRRFCCPNINTER,
    value: TpCRInfoCRIRRFEnum.IRRFCCPNINTER,
  },
  {
    label: TpCRLabelInfoCRIRRFEnum.IRRFRRA,
    value: TpCRInfoCRIRRFEnum.IRRFRRA,
  }
];
