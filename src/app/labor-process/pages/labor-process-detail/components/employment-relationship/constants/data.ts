import { MtvDesligEnum, MtvDesligLabelEnum, OptionsAnswer, OptionsAnswerLabel, PensAlimEnum, PensAlimLabelEnum, TmpParcEnum, TmpParcLabelEnum, TpContrDuracaoEnum, TpContrDuracaoLabelEnum, TpInscEnum, TpInscLabelEnum, TpRegPrevEnum, TpRegPrevLabelEnum, TpRegTrabEnum } from '../../../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../../../../utils/optional-values-formatter-utils';

export const OPTIONS_TP_REG_PREV = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: TpRegPrevLabelEnum.regimeGeral,
    value: TpRegPrevEnum.regimeGeral,
  },
  {
    label: TpRegPrevLabelEnum.regimeProprio,
    value: TpRegPrevEnum.regimeProprio,
  },
  {
    label: TpRegPrevLabelEnum.regimeNoExterior,
    value: TpRegPrevEnum.regimeNoExterior,
  }
];

export const OPTIONS_TMP_PARC = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: TmpParcLabelEnum.contrTempParc,
    value: TmpParcEnum.contrTempParc,
  },
  {
    label: TmpParcLabelEnum.lmt25hSem,
    value: TmpParcEnum.lmt25hSem,
  },
  {
    label: TmpParcLabelEnum.lmt30hSem,
    value: TmpParcEnum.lmt30hSem,
  },
  {
    label: TmpParcLabelEnum.lmt26hSem,
    value: TmpParcEnum.lmt26hSem,
  },
];

export const OPTIONS_TP_CONTR = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: TpContrDuracaoLabelEnum.prazoIndeterminado,
    value: TpContrDuracaoEnum.prazoIndeterminado,
  },
  {
    label: TpContrDuracaoLabelEnum.prazoDeterminadoDias,
    value: TpContrDuracaoEnum.prazoDeterminadoDias,
  },
  {
    label: TpContrDuracaoLabelEnum.prazoDeterminadoFato,
    value: TpContrDuracaoEnum.prazoDeterminadoFato,
  },
];

export const OPTIONS_TP_REG_TRAB = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: 'CLT - Consolidação das Leis de Trabalho e legislações trabalhistas específicas',
    value: TpRegTrabEnum.CLT,
  },
  {
    label: 'Estatutário/legislações específicas (servidor temporário, militar, agente político, etc.)',
    value: TpRegTrabEnum.EstatOuLegislEspec,
  },
];

export const OPTIONS_CLAU_ASSEC = [
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

export const OPTIONS_TP_INSC = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: TpInscLabelEnum.Cnpj,
    value: TpInscEnum.Cnpj,
  },
  {
    label: TpInscLabelEnum.Cpf,
    value: TpInscEnum.Cpf,
  },
  {
    label: TpInscLabelEnum.Cgc,
    value: TpInscEnum.Cgc,
  },
  {
    label: TpInscLabelEnum.Cei,
    value: TpInscEnum.Cei,
  },
];

export const OPTIONS_MTV_DESLIG = [
  {
    label: '',
    value: null,
  },
  {
    label: MtvDesligLabelEnum.rescComJC,
    value: MtvDesligEnum.rescComJC,
  },
  {
    label: MtvDesligLabelEnum.rescSemJC,
    value: MtvDesligEnum.rescSemJC,
  },
  {
    label: MtvDesligLabelEnum.rescAntInicEmpregador,
    value: MtvDesligEnum.rescAntInicEmpregador,
  },
  {
    label: MtvDesligLabelEnum.rescAntInicEmpregado,
    value: MtvDesligEnum.rescAntInicEmpregado,
  },
  {
    label: MtvDesligLabelEnum.rescPorCulpa,
    value: MtvDesligEnum.rescPorCulpa,
  },
  {
    label: MtvDesligLabelEnum.rescPorTermContr,
    value: MtvDesligEnum.rescPorTermContr,
  },
  {
    label: MtvDesligLabelEnum.rescContrInicEmpregado,
    value: MtvDesligEnum.rescContrInicEmpregado,
  },
  {
    label: MtvDesligLabelEnum.rescContrInteresseEmpregado,
    value: MtvDesligEnum.rescContrInteresseEmpregado,
  },
  {
    label: MtvDesligLabelEnum.rescContrOpcaoEmpregado,
    value: MtvDesligEnum.rescContrOpcaoEmpregado,
  },
  {
    label: MtvDesligLabelEnum.rescPorFalecimentoEmpregado,
    value: MtvDesligEnum.rescPorFalecimentoEmpregado,
  },
  {
    label: MtvDesligLabelEnum.transfEmpregadoPEmpMesmoGrupo,
    value: MtvDesligEnum.transfEmpregadoPEmpMesmoGrupo,
  },
  {
    label: MtvDesligLabelEnum.transfEmpregadoPEmpConsorciada,
    value: MtvDesligEnum.transfEmpregadoPEmpConsorciada,
  },
  {
    label: MtvDesligLabelEnum.transfEmpregadoPEmpOuConsorcio,
    value: MtvDesligEnum.transfEmpregadoPEmpOuConsorcio,
  },
  {
    label: MtvDesligLabelEnum.rescPorEncerramentoEmp,
    value: MtvDesligEnum.rescPorEncerramentoEmp,
  },
  {
    label: MtvDesligLabelEnum.rescContrAprendizagem,
    value: MtvDesligEnum.rescContrAprendizagem,
  },
  {
    label: MtvDesligLabelEnum.declaracaoNulidade,
    value: MtvDesligEnum.declaracaoNulidade,
  },
  {
    label: MtvDesligLabelEnum.rescisaoIndCT,
    value: MtvDesligEnum.rescisaoIndCT,
  },
  {
    label: MtvDesligLabelEnum.aposentadoriaComp,
    value: MtvDesligEnum.aposentadoriaComp,
  },
  {
    label: MtvDesligLabelEnum.aposentadoriaPIdade,
    value: MtvDesligEnum.aposentadoriaPIdade,
  },
  {
    label: MtvDesligLabelEnum.aposentadoriaPIdadeTC,
    value: MtvDesligEnum.aposentadoriaPIdadeTC,
  },
  {
    label: MtvDesligLabelEnum.refMilitar,
    value: MtvDesligEnum.refMilitar,
  },
  {
    label: MtvDesligLabelEnum.reserMilitar,
    value: MtvDesligEnum.reserMilitar,
  },
  {
    label: MtvDesligLabelEnum.exoneracao,
    value: MtvDesligEnum.exoneracao,
  },
  {
    label: MtvDesligLabelEnum.demissao,
    value: MtvDesligEnum.demissao,
  },
  {
    label: MtvDesligLabelEnum.vacancia,
    value: MtvDesligEnum.vacancia,
  },
  {
    label: MtvDesligLabelEnum.rescCTParalisacao,
    value: MtvDesligEnum.rescCTParalisacao,
  },
  {
    label: MtvDesligLabelEnum.rescMotForcaMaior,
    value: MtvDesligEnum.rescMotForcaMaior,
  },
  {
    label: MtvDesligLabelEnum.terminoCessao,
    value: MtvDesligEnum.terminoCessao,
  },
  {
    label: MtvDesligLabelEnum.redistribuicaoOuRefAdministrativa,
    value: MtvDesligEnum.redistribuicaoOuRefAdministrativa,
  },
  {
    label: MtvDesligLabelEnum.mudancaRegTrab,
    value: MtvDesligEnum.mudancaRegTrab,
  },
  {
    label: MtvDesligLabelEnum.reversaoouReint,
    value: MtvDesligEnum.reversaoouReint,
  },
  {
    label: MtvDesligLabelEnum.extravioMilitar,
    value: MtvDesligEnum.extravioMilitar,
  },
  {
    label: MtvDesligLabelEnum.rescAcordoEntrePartes,
    value: MtvDesligEnum.rescAcordoEntrePartes,
  },
  {
    label: MtvDesligLabelEnum.transTitularidade,
    value: MtvDesligEnum.transTitularidade,
  },
  {
    label: MtvDesligLabelEnum.extincaoContrTrab,
    value: MtvDesligEnum.extincaoContrTrab,
  },
  {
    label: MtvDesligLabelEnum.mudancaCPF,
    value: MtvDesligEnum.mudancaCPF,
  },
  {
    label: MtvDesligLabelEnum.remocao,
    value: MtvDesligEnum.remocao,
  },
  {
    label: MtvDesligLabelEnum.aposentadoria,
    value: MtvDesligEnum.aposentadoria,
  },
  {
    label: MtvDesligLabelEnum.aposentadoriaServEstatutario,
    value: MtvDesligEnum.aposentadoriaServEstatutario,
  },
  {
    label: MtvDesligLabelEnum.termMandatoEletivo,
    value: MtvDesligEnum.termMandatoEletivo,
  },
  {
    label: MtvDesligLabelEnum.rescAprendizagemPorDesempenhoIns,
    value: MtvDesligEnum.rescAprendizagemPorDesempenhoIns,
  },
  {
    label: MtvDesligLabelEnum.rescAprendizagemPorAusenciaInj,
    value: MtvDesligEnum.rescAprendizagemPorAusenciaInj,
  },
  {
    label: MtvDesligLabelEnum.transEmpregEmpInapta,
    value: MtvDesligEnum.transEmpregEmpInapta,
  },
  {
    label: MtvDesligLabelEnum.agrupamentoContratual,
    value: MtvDesligEnum.agrupamentoContratual,
  },
];

export const OPTIONS_PENS_ALIM = [
  OptionalValuesFormatterUtils.EMPTY_SELECT_OPTION,
  {
    label: PensAlimLabelEnum.naoExistePensao,
    value: PensAlimEnum.naoExistePensao,
  },
  {
    label: PensAlimLabelEnum.percentPensao,
    value: PensAlimEnum.percentPensao,
  },
  {
    label: PensAlimLabelEnum.valorPensao,
    value: PensAlimEnum.valorPensao,
  },
  {
    label: PensAlimLabelEnum.percentEValorPensao,
    value: PensAlimEnum.percentEValorPensao,
  },
];

export const COLUMNS = [
  {
    label: 'Observação',
    property: 'observacao',
    width: '100%',
  },
];
