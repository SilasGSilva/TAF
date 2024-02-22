import { CodCategEnum, CodCategLabelEnum, DocumentTypeEnum, IndRepercEnum, OptionsAnswer, OptionsAnswerLabel, TypeContract } from '../../../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../../../../utils/optional-values-formatter-utils';

export const OPTIONS_TP_CONTR = [
  {
    label: 'Trabalhador com vínculo formalizado, sem alteração nas datas de admissão e de desligamento',
    value: TypeContract.TrabalhadorComVincSemAlt,
  },
  {
    label: 'Trabalhador com vínculo formalizado, com alteração na data de admissão',
    value: TypeContract.TrabalhadorComVincComAlt,
  },
  {
    label: 'Trabalhador com vínculo formalizado, com inclusão ou alteração de data de desligamento',
    value: TypeContract.TrabalhadorComVincComInclAlt,
  },
  {
    label: 'Trabalhador com vínculo formalizado, com alteração nas datas de admissão e de desligamento',
    value: TypeContract.TrabalhadorComVincComAltData,
  },
  {
    label: 'Empregado com reconhecimento de vínculo',
    value: TypeContract.EmpregadoComReconhecimentoVinc,
  },
  {
    label: 'Trabalhador sem vínculo de emprego/estatutário (TSVE), sem reconhecimento de vínculo empregatício',
    value: TypeContract.TrabSemVinculo,
  },
  {
    label: 'Trabalhador com vínculo de empregado formalizado em período anterior ao eSocial',
    value: TypeContract.TrabComVincAntEsocial,
  },
  {
    label: 'Responsabilidade indireta',
    value: TypeContract.RespIndireta,
  },
  {
    label: 'Trabalhador cujos contratos foram unificados',
    value: TypeContract.TrabContrUnificados,
  },
];

export const OPTIONS_IND_REINT = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
  {
    label: OptionsAnswerLabel.No,
    value: OptionsAnswer.No,
  },
];

export const OPTIONS_IND_UNIC = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
  {
    label: OptionsAnswerLabel.No,
    value: OptionsAnswer.No,
  },
];

export const OPTIONS_TYPE_INSC = [
  {
    label: 'CNPJ',
    value: DocumentTypeEnum.Cnpj
  },
  {
    label: 'CAEPF',
    value: DocumentTypeEnum.Caepf
  },
  {
    label: 'CNO',
    value: DocumentTypeEnum.Cno
  },
];

export const OPTIONS_ANSWER = [
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
  {
    label: OptionsAnswerLabel.No,
    value: OptionsAnswer.No,
  },
];

export const OPTIONS_COD_CATEG = [
  {
    label: '',
    value: null,
  },
  {
    label: CodCategLabelEnum.EmpregadoGeral,
    value: CodCategEnum.EmpregadoGeral,
  },
  {
    label: CodCategLabelEnum.EmpregadoRural,
    value: CodCategEnum.EmpregadoRural,
  },
  {
    label: CodCategLabelEnum.Aprendiz,
    value: CodCategEnum.Aprendiz,
  },
  {
    label: CodCategLabelEnum.Domestico,
    value: CodCategEnum.Domestico,
  },
  {
    label: CodCategLabelEnum.ContratoTermoFirmado,
    value: CodCategEnum.ContratoTermoFirmado,
  },
  {
    label: CodCategLabelEnum.TrabTemporario,
    value: CodCategEnum.TrabTemporario,
  },
  {
    label: CodCategLabelEnum.ContrVerdeAmarelo,
    value: CodCategEnum.ContrVerdeAmarelo,
  },
  {
    label: CodCategLabelEnum.ContrVerdeAmareloComAcordo,
    value: CodCategEnum.ContrVerdeAmareloComAcordo,
  },
  {
    label: CodCategLabelEnum.Intermitente,
    value: CodCategEnum.Intermitente,
  },
  {
    label: CodCategLabelEnum.TrabAvulso,
    value: CodCategEnum.TrabAvulso,
  },
  {
    label: CodCategLabelEnum.TrabAvulsoNaoPortuario,
    value: CodCategEnum.TrabAvulsoNaoPortuario,
  },
  {
    label: CodCategLabelEnum.ServPubefetivo,
    value: CodCategEnum.ServPubefetivo,
  },
  {
    label: CodCategLabelEnum.ServPublicoComissao,
    value: CodCategEnum.ServPublicoComissao,
  },
  {
    label: CodCategLabelEnum.MandatoEletivo,
    value: CodCategEnum.MandatoEletivo,
  },
  {
    label: CodCategLabelEnum.MandatoEletivoComissao,
    value: CodCategEnum.MandatoEletivoComissao,
  },
  {
    label: CodCategLabelEnum.SerPubConselho,
    value: CodCategEnum.SerPubConselho,
  },
  {
    label: CodCategLabelEnum.SerPubContrTempoDeterminado,
    value: CodCategEnum.SerPubContrTempoDeterminado,
  },
  {
    label: CodCategLabelEnum.Militar,
    value: CodCategEnum.Militar,
  },
  {
    label: CodCategLabelEnum.Conscrito,
    value: CodCategEnum.Conscrito,
  },
  {
    label: CodCategLabelEnum.AgentePublico,
    value: CodCategEnum.AgentePublico,
  },
  {
    label: CodCategLabelEnum.ServidorPublicoEventual,
    value: CodCategEnum.ServidorPublicoEventual,
  },
  {
    label: CodCategLabelEnum.Ministros,
    value: CodCategEnum.Ministros,
  },
  {
    label: CodCategLabelEnum.Auxiliar,
    value: CodCategEnum.Auxiliar,
  },
  {
    label: CodCategLabelEnum.ServPubInstrutoria,
    value: CodCategEnum.ServPubInstrutoria,
  },
  {
    label: CodCategLabelEnum.MilitarForcasArmadas,
    value: CodCategEnum.MilitarForcasArmadas,
  },
  {
    label: CodCategLabelEnum.DirigenteSindical,
    value: CodCategEnum.DirigenteSindical,
  },
  {
    label: CodCategLabelEnum.TrabCedido,
    value: CodCategEnum.TrabCedido,
  },
  {
    label: CodCategLabelEnum.DirigenteSindicalSegurado,
    value: CodCategEnum.DirigenteSindicalSegurado,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndiv,
    value: CodCategEnum.ContribuinteIndiv,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivTransportadorAP,
    value: CodCategEnum.ContribuinteIndivTransportadorAP,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivTransportadorAC,
    value: CodCategEnum.ContribuinteIndivTransportadorAC,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivDiretorComFgts,
    value: CodCategEnum.ContribuinteIndivDiretorComFgts,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivDiretorSemFgts,
    value: CodCategEnum.ContribuinteIndivDiretorSemFgts,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivEmpresario,
    value: CodCategEnum.ContribuinteIndivEmpresario,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivCooperado,
    value: CodCategEnum.ContribuinteIndivCooperado,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivTransp,
    value: CodCategEnum.ContribuinteIndivTransp,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivCooperadoFiliado,
    value: CodCategEnum.ContribuinteIndivCooperadoFiliado,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivMicro,
    value: CodCategEnum.ContribuinteIndivMicro,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivMagistrado,
    value: CodCategEnum.ContribuinteIndivMagistrado,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivAssociado,
    value: CodCategEnum.ContribuinteIndivAssociado,
  },
  {
    label: CodCategLabelEnum.ContribuinteIndivConsTutelar,
    value: CodCategEnum.ContribuinteIndivConsTutelar,
  },
  {
    label: CodCategLabelEnum.MinistroConfissao,
    value: CodCategEnum.MinistroConfissao,
  },
  {
    label: CodCategLabelEnum.Estagiario,
    value: CodCategEnum.Estagiario,
  },
  {
    label: CodCategLabelEnum.Medico,
    value: CodCategEnum.Medico,
  },
  {
    label: CodCategLabelEnum.Bolsista,
    value: CodCategEnum.Bolsista,
  },
  {
    label: CodCategLabelEnum.ParticipanteCurso,
    value: CodCategEnum.ParticipanteCurso,
  },
  {
    label: CodCategLabelEnum.BeneficiarioProgNac,
    value: CodCategEnum.BeneficiarioProgNac,
  },
];

export const OPTIONS_IND_REPERC = [
  {
    label: 'Decisão com repercussão tributária e/ou FGTS',
    value: IndRepercEnum.DecisComRepercTrib,
  },
  {
    label: 'Decisão sem repercussão tributária ou FGTS',
    value: IndRepercEnum.DecisSemRepercTrib,
  },
  {
    label: 'Decisão com repercussão exclusiva para declaração de rendimentos para fins de Imposto de Renda',
    value: IndRepercEnum.DecisComRepercExclus,
  },
];

export const OPTIONS_INDEN_SD = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
];

export const OPTIONS_INDEN_ABONO = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
];

export const OPTIONS_PAG_DIRETO_RESC = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: OptionsAnswerLabel.Yes,
    value: OptionsAnswer.Yes,
  },
  {
    label: OptionsAnswerLabel.No,
    value: OptionsAnswer.No,
  },
];
