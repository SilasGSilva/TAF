import { DocumentTypeEnum, OrigemEnum, OrigemLabelEnum, TpCCPEnum, TpCCPLabelEnum } from '../../../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../../../../utils/optional-values-formatter-utils';

export const OPTIONS_TP_INSC = [
  {
    label: '',
    value: null,
  },
  {
    label: 'CNPJ',
    value: DocumentTypeEnum.Cnpj,
  },
  {
    label: 'CPF',
    value: DocumentTypeEnum.Cpf,
  },
];

export const OPTIONS_ORIGEM = [
  {
    label: OrigemLabelEnum.procJud,
    value: OrigemEnum.procJud,
  },
  {
    label: OrigemLabelEnum.demandaSubm,
    value: OrigemEnum.demandaSubm,
  },
];

export const OPTIONS_UF_VARA = [
  {
    label: '',
    value: null,
  },
  {
    label: 'AC',
    value: 'AC',
  },
  {
    label: 'AL',
    value: 'AL',
  },
  {
    label: 'AP',
    value: 'AP',
  },
  {
    label: 'AM',
    value: 'AM',
  },
  {
    label: 'BA',
    value: 'BA',
  },
  {
    label: 'CE',
    value: 'CE',
  },
  {
    label: 'DF',
    value: 'DF',
  },
  {
    label: 'ES',
    value: 'ES',
  },
  {
    label: 'GO',
    value: 'GO',
  },
  {
    label: 'MA',
    value: 'MA',
  },
  {
    label: 'MT',
    value: 'MT',
  },
  {
    label: 'MS',
    value: 'MS',
  },
  {
    label: 'MG',
    value: 'MG',
  },
  {
    label: 'PA',
    value: 'PA',
  },
  {
    label: 'PB',
    value: 'PB',
  },
  {
    label: 'PR',
    value: 'PR',
  },
  {
    label: 'PE',
    value: 'PE',
  },
  {
    label: 'PI',
    value: 'PI',
  },
  {
    label: 'RJ',
    value: 'RJ',
  },
  {
    label: 'RN',
    value: 'RN',
  },
  {
    label: 'RS',
    value: 'RS',
  },
  {
    label: 'RO',
    value: 'RO',
  },
  {
    label: 'RR',
    value: 'RR',
  },
  {
    label: 'SC',
    value: 'SC',
  },
  {
    label: 'SP',
    value: 'SP',
  },
  {
    label: 'SE',
    value: 'SE',
  },
  {
    label: 'TO',
    value: 'TO',
  },
];

export const OPTIONS_TP_CCP = [
  {
    label: '',
    value: null,
  },
  {
    label: TpCCPLabelEnum.CCPAmbitoEmpresa,
    value: TpCCPEnum.CCPAmbitoEmpresa,
  },
  {
    label: TpCCPLabelEnum.CCPAmbitoSindicato,
    value: TpCCPEnum.CCPAmbitoSindicato,
  },
  {
    label: TpCCPLabelEnum.NINTER,
    value: TpCCPEnum.NINTER,
  },
]
