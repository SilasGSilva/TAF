import { TpDepLabelEnum, TpDepEnum } from '../.../../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer, OptionsAnswerLabel } from '../.../../../../../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../.../../../../../../../utils/optional-values-formatter-utils';

export const COLUMNS = [
  {
    label: 'CPF',
    property: 'cpfDepLabel',
    width: '10%',
  },
  {
    label: 'Nome',
    property: 'nomeLabel',
    width: '50%',
  },
  {
    label: 'Descrição da dependência',
    property: 'descrDepLabel',
    width: '40%',
  },
];

export const OPTIONS_DEP_IRRF = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
];

export const OPTIONS_TP_DEP = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: TpDepLabelEnum.Conjuge,
    value: TpDepEnum.Conjuge,
  },
  {
    label: TpDepLabelEnum.CompanheiroComFilho,
    value: TpDepEnum.CompanheiroComFilho,
  },
  {
    label: TpDepLabelEnum.Filho,
    value: TpDepEnum.Filho,
  },
  {
    label: TpDepLabelEnum.FilhoOuEnteadoUniversitário,
    value: TpDepEnum.FilhoOuEnteadoUniversitário,
  },
  {
    label: TpDepLabelEnum.IrmaoNetoBisnetoSemArrimoComGuardaJudicial,
    value: TpDepEnum.IrmaoNetoBisnetoSemArrimoComGuardaJudicial,
  },
  {
    label: TpDepLabelEnum.IrmaoNetoBisnetoSemArrimoUniversitario,
    value: TpDepEnum.IrmaoNetoBisnetoSemArrimoUniversitario,
  },
  {
    label: TpDepLabelEnum.PaisAvosBisavos,
    value: TpDepEnum.PaisAvosBisavos,
  },
  {
    label: TpDepLabelEnum.MenorGuardaJudicial,
    value: TpDepEnum.MenorGuardaJudicial,
  },
  {
    label: TpDepLabelEnum.PessoaIncapaz,
    value: TpDepEnum.PessoaIncapaz,
  },
  {
    label: TpDepLabelEnum.ExConjuge,
    value: TpDepEnum.ExConjuge,
  },
  {
    label: TpDepLabelEnum.AgregadoOutros,
    value: TpDepEnum.AgregadoOutros,
  },
];
