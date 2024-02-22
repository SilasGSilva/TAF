import { MtvDesligTSVEnum, MtvDesligTSVLabelEnum, NatAtividadeEnum, NatAtividadeLabelEnum, UndSalFixoEnum, UndSalFixoLabelEnum } from '../../../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../../../../utils/optional-values-formatter-utils';

export const COLUMNS = [
  {
    label: 'Data',
    property: 'dtRemunLabel',
    width: '20%',
    type: 'date',
  },
  {
    label: 'Salário Base',
    property: 'vrSalFxLabel',
    width: '20%',
    type: 'currency',
    format: 'BRL'
  },
  {
    label: 'Unidade',
    property: 'undSalFixoLabel',
    width: '60%',
  },
];

export const OPTIONS_NAT_ATIVIDADE = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: NatAtividadeLabelEnum.trabUrbano,
    value: NatAtividadeEnum.trabUrbano,
  },
  {
    label: NatAtividadeLabelEnum.trabRural,
    value: NatAtividadeEnum.trabRural,
  },
];

export const OPTIONS_MTV_DESLIG_TSV = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: MtvDesligTSVLabelEnum.exoneracaoDirSemJC,
    value: MtvDesligTSVEnum.exoneracaoDirSemJC,
  },
  {
    label: MtvDesligTSVLabelEnum.terminoMandDiretor,
    value: MtvDesligTSVEnum.terminoMandDiretor,
  },
  {
    label: MtvDesligTSVLabelEnum.exoneracaoPedDiretorNE,
    value: MtvDesligTSVEnum.exoneracaoPedDiretorNE,
  },
  {
    label: MtvDesligTSVLabelEnum.exoneracaoPedDiretorNECulpa,
    value: MtvDesligTSVEnum.exoneracaoPedDiretorNECulpa,
  },
  {
    label: MtvDesligTSVLabelEnum.morteDirNE,
    value: MtvDesligTSVEnum.morteDirNE,
  },
  {
    label: MtvDesligTSVLabelEnum.exoneracaoDirNEFalencia,
    value: MtvDesligTSVEnum.exoneracaoDirNEFalencia,
  },
  {
    label: MtvDesligTSVLabelEnum.outros,
    value: MtvDesligTSVEnum.outros,
  },
];

export const OPTIONS_UND_SAL_FIXO = [
  {
    label: UndSalFixoLabelEnum.hora,
    value: UndSalFixoEnum.hora,
  },
  {
    label: UndSalFixoLabelEnum.dia,
    value: UndSalFixoEnum.dia,
  },
  {
    label: UndSalFixoLabelEnum.semana,
    value: UndSalFixoEnum.semana,
  },
  {
    label: UndSalFixoLabelEnum.quinzena,
    value: UndSalFixoEnum.quinzena,
  },
  {
    label: UndSalFixoLabelEnum.mes,
    value: UndSalFixoEnum.mes,
  },
  {
    label: UndSalFixoLabelEnum.tarefa,
    value: UndSalFixoEnum.tarefa,
  },
  {
    label: UndSalFixoLabelEnum.naoAplicavel,
    value: UndSalFixoEnum.naoAplicavel,
  },
];
