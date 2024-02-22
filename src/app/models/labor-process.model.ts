export interface TotvsPage<T> {
  hasNext: boolean;
  items: T[];
}

export interface ESocialVersion {
  eSocialLayoutVersion: ESocialVersionEnum;
  branchId?: string;
  companyId?: string;
}

export enum ESocialVersionEnum {
  v1 = 1,
  v2 = 2,
}

export interface LaborProcess {
  id?: string;
  companyId: string;
  branchId: string;
  userName: string;
  excluidoERP: string;
  infoProcesso: InfoProcesso;
  ideTrab: IdeTrab;
}

export interface InfoProcesso {
  ideResp: IdeResp;
  origem: OrigemEnum;
  nrProcTrab: string;
  obsProcTrab: string;
  dadosCompl: DadosCompl;
}

export interface IdeResp {
  tpInsc: TpInscEnum;
  nrInsc: string;
}

export interface DadosCompl {
  infoProcJud: InfoProcJud;
  infoCCP: InfoCCP;
}

export interface InfoProcJud {
  ufVara: string;
  dtSent: Date;
  codMunic: number;
  idVara: number;
}

export interface InfoCCP {
  dtCCP: Date;
  tpCCP: TpCCPEnum;
  cnpjCCP: string;
}

export interface IdeTrab {
  cpfTrab: string;
  nmTrab: string;
  dtNascto: Date;
  dependente?: Dependente[];
  infoContr: InfoContr[];
}

export interface Dependente {
  cpfDep: string;
  tpDep: TpDepEnum;
  descDep: string;
}

export interface InfoContr {
  tpContr: TypeContract;
  indContr: OptionsAnswer;
  dtAdmOrig: Date;
  indReint: OptionsAnswer;
  indCateg: OptionsAnswer;
  indNatAtiv: OptionsAnswer;
  indMotDeslig: OptionsAnswer;
  indUnic?: OptionsAnswer;
  matricula: string;
  codCateg: CodCategEnum;
  dtInicio: Date;
  ideEstab: IdeEstab;
  mudCategAtiv: MudCategAtiv[];
  unicContr: UnicContr[];
  infoCompl: InfoCompl;
}

export interface IdeEstab {
  tpInsc: number;
  nrInsc: string;
  infoVlr: InfoVlr;
}

export interface InfoVlr {
  compIni: string;
  compFim: string;
  indReperc: IndRepercEnum;
  indenSD: OptionsAnswer;
  indenAbono: OptionsAnswer;
  abono: Abono[];
  repercProc?: number;
  vrRemun?: number;
  vrAPI?: number;
  vr13API?: number;
  vrInden?: number;
  vrBaseIndenFGTS?: number;
  pagDiretoResc?: OptionsAnswer;
  idePeriodo: IdePeriodo[];
}

export interface Abono {
  anoBase: string;
}

export interface IdePeriodo {
  perRef: string;
  baseCalculo: BaseCalculo;
  infoFGTS: InfoFGTS;
  baseMudCateg: BaseMudCateg;
}

export interface BaseCalculo {
  vrBcCpMensal: number;
  vrBcCp13: number;
  vrBcFgts?: number;
  vrBcFgts13?: number;
  infoAgNocivo: InfoAgNocivo;
}

export interface InfoAgNocivo {
  grauExp: GrauExpEnum;
}

export interface InfoFGTS {
  vrBcFGTSProcTrab: number;
  vrBcFGTSSefip: number;
  vrBcFGTSDecAnt: number;
  vrBcFgtsGuia?: number;
  vrBcFgts13Guia?: number;
  pagDireto?: OptionsAnswer;
}

export interface BaseMudCateg {
  codCateg: CodCategEnum;
  vrBcCPrev: number;
}

export interface MudCategAtiv {
  codCateg: CodCategEnum;
  natAtividade: NatAtividadeEnum;
  dtMudCategAtiv: Date;
}

export interface UnicContr {
  matUnic: string;
  codCateg: CodCategEnum;
  dtInicio: Date;
}

export interface InfoCompl {
  codCBO: string;
  natAtividade: NatAtividadeEnum;
  remuneracao: Remuneracao[];
  infoVinc: InfoVinc;
  infoTerm: InfoTerm;
}

export interface Remuneracao {
  dtRemun: Date;
  vrSalFx: number;
  undSalFixo: UndSalFixoEnum;
  dscSalVar: string;
}

export interface InfoVinc {
  tpRegTrab: TpRegTrabEnum;
  tpRegPrev: TpRegPrevEnum;
  dtAdm: Date;
  tmpParc: TmpParcEnum;
  duracao: Duracao;
  observacoes: Observacoes[];
  sucessaoVinc: SucessaoVinc;
  infoDeslig: InfoDeslig;
}

export interface Duracao {
  tpContr: TpContrDuracaoEnum;
  dtTerm: Date;
  clauAssec: OptionsAnswer;
  objDet: string;
}

export interface Observacoes {
  observacao: string;
}

export interface SucessaoVinc {
  tpInsc: TpInscEnum;
  nrInsc: string;
  matricAnt: string;
  dtTransf: Date;
}

export interface InfoDeslig {
  dtDeslig: Date;
  mtvDeslig: MtvDesligEnum;
  dtProjFimAPI: Date;
  pensAlim: PensAlimEnum;
  percAliment: number;
  vrAlim: number;
}

export interface InfoTerm {
  dtTerm: Date;
  mtvDesligTSV: MtvDesligTSVEnum;
}

export interface InfoContrSimple {
  tpContr: TypeContract;
  indContr: string;
  indCateg: string;
  indNatAtiv: string;
  indMotDeslig: string;
}

export enum IndRepercEnum {
  DecisComRepercTrib = 1,
  DecisSemRepercTrib = 2,
  DecisComRepercExclus = 3,
}

export enum TpRegPrevEnum {
  regimeGeral = 1,
  regimeProprio = 2,
  regimeNoExterior = 3,
}

export enum TpRegPrevLabelEnum {
  regimeGeral = 'Regime Geral de Previdência Social - RGPS',
  regimeProprio = 'Regime Próprio de Previdência Social - RPPS',
  regimeNoExterior = 'Regime de Previdência Social no exterior',
}

export enum TpRegTrabEnum {
  CLT = 1,
  EstatOuLegislEspec = 2,
}

export enum OrigemEnum {
  procJud = 1,
  demandaSubm = 2,
}

export enum OrigemLabelEnum {
  procJud = 'Processo Judicial',
  demandaSubm = 'Demanda submetida à CCP ou ao NINTER',
}

export enum TpCCPEnum {
  CCPAmbitoEmpresa = 1,
  CCPAmbitoSindicato = 2,
  NINTER = 3,
}

export enum TpCCPLabelEnum {
  CCPAmbitoEmpresa = 'CCP no âmbito de empresa',
  CCPAmbitoSindicato = 'CCP no âmbito de sindicato',
  NINTER = 'NINTER',
}

export enum MtvDesligEnum {
  rescComJC = '01',
  rescSemJC = '02',
  rescAntInicEmpregador = '03',
  rescAntInicEmpregado = '04',
  rescPorCulpa = '05',
  rescPorTermContr = '06',
  rescContrInicEmpregado = '07',
  rescContrInteresseEmpregado = '08',
  rescContrOpcaoEmpregado = '09',
  rescPorFalecimentoEmpregado = '10',
  transfEmpregadoPEmpMesmoGrupo = '11',
  transfEmpregadoPEmpConsorciada = '12',
  transfEmpregadoPEmpOuConsorcio = '13',
  rescPorEncerramentoEmp = '14',
  rescContrAprendizagem = '15',
  declaracaoNulidade = '16',
  rescisaoIndCT = '17',
  aposentadoriaComp = '18',
  aposentadoriaPIdade = '19',
  aposentadoriaPIdadeTC = '20',
  refMilitar = '21',
  reserMilitar = '22',
  exoneracao = '23',
  demissao = '24',
  vacancia = '25',
  rescCTParalisacao = '26',
  rescMotForcaMaior = '27',
  terminoCessao = '28',
  redistribuicaoOuRefAdministrativa = '29',
  mudancaRegTrab = '30',
  reversaoouReint = '31',
  extravioMilitar = '32',
  rescAcordoEntrePartes = '33',
  transTitularidade = '34',
  extincaoContrTrab = '35',
  mudancaCPF = '36',
  remocao = '37',
  aposentadoria = '38',
  aposentadoriaServEstatutario = '39',
  termMandatoEletivo = '40',
  rescAprendizagemPorDesempenhoIns = '41',
  rescAprendizagemPorAusenciaInj = '42',
  transEmpregEmpInapta = '43',
  agrupamentoContratual = '44',
}

export enum MtvDesligLabelEnum {
  rescComJC = 'Rescisão com justa causa, por iniciativa do empregador',
  rescSemJC = 'Rescisão sem justa causa, por iniciativa do empregador',
  rescAntInicEmpregador = 'Rescisão antecipada do contrato a termo por iniciativa do empregador',
  rescAntInicEmpregado = 'Rescisão antecipada do contrato a termo por iniciativa do empregado',
  rescPorCulpa = 'Rescisão por culpa recíproca',
  rescPorTermContr = 'Rescisão por término do contrato a termo',
  rescContrInicEmpregado = 'Rescisão do contrato de trabalho por iniciativa do empregado',
  rescContrInteresseEmpregado = 'Rescisão do contrato de trabalho por interesse do(a) empregado(a), nas hipóteses previstas nos arts. 394 e 483, § 1º, da CLT',
  rescContrOpcaoEmpregado = 'Rescisão por opção do empregado em virtude de falecimento do empregador individual ou empregador doméstico',
  rescPorFalecimentoEmpregado = 'Rescisão por falecimento do empregado',
  transfEmpregadoPEmpMesmoGrupo = 'Transferência de empregado para empresa do mesmo grupo empresarial que tenha assumido os encargos trabalhistas, sem que tenha havido rescisão do contrato de trabalho',
  transfEmpregadoPEmpConsorciada = 'Transferência de empregado da empresa consorciada para o consórcio que tenha assumido os encargos trabalhistas, e vice-versa, sem que tenha havido rescisão do contrato de trabalho',
  transfEmpregadoPEmpOuConsorcio = 'Transferência de empregado de empresa ou consórcio, para outra empresa ou consórcio que tenha assumido os encargos trabalhistas por motivo de sucessão (fusão, cisão ou incorporação), sem que tenha havido rescisão do contrato de trabalho',
  rescPorEncerramentoEmp = 'Rescisão do contrato de trabalho por encerramento da empresa, de seus estabelecimentos ou supressão de parte de suas atividades ou falecimento do empregador individual ou empregador doméstico sem continuação da atividade',
  rescContrAprendizagem = 'Rescisão do contrato de aprendizagem por desempenho insuficiente, inadaptação ou ausência injustificada do aprendiz à escola que implique perda do ano letivo',
  declaracaoNulidade = 'Declaração de nulidade do contrato de trabalho por infringência ao inciso II do art. 37 da Constituição Federal, quando mantido o direito ao salário',
  rescisaoIndCT = 'Rescisão indireta do contrato de trabalho',
  aposentadoriaComp = 'Aposentadoria compulsória',
  aposentadoriaPIdade = 'Aposentadoria por idade',
  aposentadoriaPIdadeTC = 'Aposentadoria por idade e tempo de contribuição',
  refMilitar = 'Reforma militar',
  reserMilitar = 'Reserva militar',
  exoneracao = 'Exoneração',
  demissao = 'Demissão',
  vacancia = 'Vacância de cargo efetivo',
  rescCTParalisacao = 'Rescisão do contrato de trabalho por paralisação temporária ou definitiva da empresa, estabelecimento ou parte das atividades motivada por atos de autoridade municipal, estadual ou federal',
  rescMotForcaMaior = 'Rescisão por motivo de força maior',
  terminoCessao = 'Término da cessão/requisição',
  redistribuicaoOuRefAdministrativa = 'Redistribuição ou Reforma Administrativa',
  mudancaRegTrab = 'Mudança de regime trabalhista',
  reversaoouReint = 'Reversão de reintegração',
  extravioMilitar = 'Extravio de militar',
  rescAcordoEntrePartes = 'Rescisão por acordo entre as partes (art. 484-A da CLT)',
  transTitularidade = 'Transferência de titularidade do empregado doméstico para outro representante da mesma unidade familiar',
  extincaoContrTrab = 'Extinção do contrato de trabalho intermitente',
  mudancaCPF = 'Mudança de CPF',
  remocao = 'Remoção, em caso de alteração do órgão declarante',
  aposentadoria = 'Aposentadoria, exceto por invalidez',
  aposentadoriaServEstatutario = 'Aposentadoria de servidor estatutário, por invalidez',
  termMandatoEletivo = 'Término do exercício do mandato eletivo',
  rescAprendizagemPorDesempenhoIns = 'Rescisão do contrato de aprendizagem por desempenho insuficiente ou inadaptação do aprendiz',
  rescAprendizagemPorAusenciaInj = 'Rescisão do contrato de aprendizagem por ausência injustificada do aprendiz à escola que implique perda do ano letivo',
  transEmpregEmpInapta = 'Transferência de empregado de empresa considerada inapta por inexistência de fato',
  agrupamentoContratual = 'Agrupamento contratual',
}

export enum PensAlimEnum {
  naoExistePensao = 0,
  percentPensao = 1,
  valorPensao = 2,
  percentEValorPensao = 3,
}

export enum PensAlimLabelEnum {
  naoExistePensao = 'Não existe pensão alimentícia',
  percentPensao = 'Percentual de pensão alimentícia',
  valorPensao = 'Valor de pensão alimentícia',
  percentEValorPensao = 'Percentual e valor de pensão alimentícia',
}

export enum TmpParcEnum {
  contrTempParc = 0,
  lmt25hSem = 1,
  lmt30hSem = 2,
  lmt26hSem = 3,
}

export enum TmpParcLabelEnum {
  contrTempParc = 'Não é contrato em tempo parcial',
  lmt25hSem = 'Limitado a 25 horas semanais',
  lmt30hSem = 'Limitado a 30 horas semanais',
  lmt26hSem = 'Limitado a 26 horas semanais',
}

export enum TpContrDuracaoEnum {
  prazoIndeterminado = 1,
  prazoDeterminadoDias = 2,
  prazoDeterminadoFato = 3,
}

export enum TpContrDuracaoLabelEnum {
  prazoIndeterminado = 'Prazo indeterminado',
  prazoDeterminadoDias = 'Prazo determinado, definido em dias',
  prazoDeterminadoFato = 'Prazo determinado, vinculado à ocorrência de um fato',
}

export enum TpInscEnum {
  Cnpj = 1,
  Cpf = 2,
  Cgc = 5,
  Cei = 6,
}

export enum TpInscLabelEnum {
  Cnpj = 'CNPJ',
  Cpf = 'CPF',
  Cgc = 'CGC',
  Cei = 'CEI',
}

export enum DocumentTypeEnum {
  Cnpj = 1,
  Cpf = 2,
  Caepf = 3,
  Cno = 4,
}

export enum OptionsAnswer {
  Yes = 'S',
  No = 'N',
}

export enum OptionsAnswerLabel {
  Yes = 'Sim',
  No = 'Não',
}

export enum TpDepEnum {
  Conjuge = '01',
  CompanheiroComFilho = '02',
  Filho = '03',
  FilhoOuEnteadoUniversitário = '04',
  IrmaoNetoBisnetoSemArrimoComGuardaJudicial = '06',
  IrmaoNetoBisnetoSemArrimoUniversitario = '07',
  PaisAvosBisavos = '09',
  MenorGuardaJudicial = '10',
  PessoaIncapaz = '11',
  ExConjuge = '12',
  AgregadoOutros = '99',
}

export enum TypeContract {
  TrabalhadorComVincSemAlt = 1,
  TrabalhadorComVincComAlt = 2,
  TrabalhadorComVincComInclAlt = 3,
  TrabalhadorComVincComAltData = 4,
  EmpregadoComReconhecimentoVinc = 5,
  TrabSemVinculo = 6,
  TrabComVincAntEsocial = 7,
  RespIndireta = 8,
  TrabContrUnificados = 9,
}

export enum CodCategEnum {
  EmpregadoGeral = 101,
  EmpregadoRural = 102,
  Aprendiz = 103,
  Domestico = 104,
  ContratoTermoFirmado = 105,
  TrabTemporario = 106,
  ContrVerdeAmarelo = 107,
  ContrVerdeAmareloComAcordo = 108,
  Intermitente = 111,
  TrabAvulso = 201,
  TrabAvulsoNaoPortuario = 202,
  ServPubefetivo = 301,
  ServPublicoComissao = 302,
  MandatoEletivo = 303,
  MandatoEletivoComissao = 304,
  SerPubConselho = 305,
  SerPubContrTempoDeterminado = 306,
  Militar = 307,
  Conscrito = 308,
  AgentePublico = 309,
  ServidorPublicoEventual = 310,
  Ministros = 311,
  Auxiliar = 312,
  ServPubInstrutoria = 313,
  MilitarForcasArmadas = 314,
  DirigenteSindical = 401,
  TrabCedido = 410,
  DirigenteSindicalSegurado = 501,
  ContribuinteIndiv = 701,
  ContribuinteIndivTransportadorAP = 711,
  ContribuinteIndivTransportadorAC = 712,
  ContribuinteIndivDiretorComFgts = 721,
  ContribuinteIndivDiretorSemFgts = 722,
  ContribuinteIndivEmpresario = 723,
  ContribuinteIndivCooperado = 731,
  ContribuinteIndivTransp = 734,
  ContribuinteIndivCooperadoFiliado = 738,
  ContribuinteIndivMicro = 741,
  ContribuinteIndivMagistrado = 751,
  ContribuinteIndivAssociado = 761,
  ContribuinteIndivConsTutelar = 771,
  MinistroConfissao = 781,
  Estagiario = 901,
  Medico = 902,
  Bolsista = 903,
  ParticipanteCurso = 904,
  BeneficiarioProgNac = 906,
}

export enum CodCategLabelEnum {
  EmpregadoGeral = 'Empregado - Geral, inclusive o empregado público da administração direta ou indireta contratado pela CLT',
  EmpregadoRural = 'Empregado - Trabalhador rural por pequeno prazo da Lei 11.718/2008',
  Aprendiz = 'Empregado - Aprendiz',
  Domestico = 'Empregado - Doméstico',
  ContratoTermoFirmado = 'Empregado - Contrato a termo firmado nos termos da Lei 9.601/1998',
  TrabTemporario = 'Trabalhador temporário - Contrato nos termos da Lei 6.019/1974',
  ContrVerdeAmarelo = 'Empregado - Contrato de trabalho Verde e Amarelo - sem acordo para antecipação mensal da multa rescisória do FGTS',
  ContrVerdeAmareloComAcordo = 'Empregado - Contrato de trabalho Verde e Amarelo - com acordo para antecipação mensal da multa rescisória do FGTS',
  Intermitente = 'Empregado - Contrato de trabalho intermitente',
  TrabAvulso = 'Trabalhador avulso portuário',
  TrabAvulsoNaoPortuario = 'Trabalhador avulso não portuário',
  ServPubefetivo = 'Servidor público titular de cargo efetivo, magistrado, ministro de Tribunal de Contas, conselheiro de Tribunal de Contas e membro do Ministério Público',
  ServPublicoComissao = 'Servidor público ocupante de cargo exclusivo em comissão',
  MandatoEletivo = 'Exercente de mandato eletivo',
  MandatoEletivoComissao = 'Servidor público exercente de mandato eletivo, inclusive com exercício de cargo em comissão',
  SerPubConselho = 'Servidor público indicado para conselho ou órgão deliberativo, na condição de representante do governo, órgão ou entidade da administração pública',
  SerPubContrTempoDeterminado = 'Servidor público contratado por tempo determinado, sujeito a regime administrativo especial definido em lei própria',
  Militar = 'Militar',
  Conscrito = 'Conscrito',
  AgentePublico = 'Agente público - Outros',
  ServidorPublicoEventual = 'Servidor público eventual',
  Ministros = 'Ministros, juízes, procuradores, promotores ou oficiais de justiça à disposição da Justiça Eleitoral',
  Auxiliar = 'Auxiliar local',
  ServPubInstrutoria = 'Servidor público exercente de atividade de instrutoria, capacitação, treinamento, curso ou concurso, ou convocado para pareceres técnicos ou depoimentos',
  MilitarForcasArmadas = 'Militar das Forças Armadas',
  DirigenteSindical = 'Dirigente sindical - Informação prestada pelo sindicato',
  TrabCedido = 'Trabalhador cedido/exercício em outro órgão/juiz auxiliar - Informação prestada pelo cessionário/destino',
  DirigenteSindicalSegurado = 'Dirigente sindical - Segurado especial',
  ContribuinteIndiv = 'Contribuinte individual - Autônomo em geral, exceto se enquadrado em uma das demais categorias de contribuinte individual',
  ContribuinteIndivTransportadorAP = 'Contribuinte individual - Transportador autônomo de passageiros',
  ContribuinteIndivTransportadorAC = 'Contribuinte individual - Transportador autônomo de carga',
  ContribuinteIndivDiretorComFgts = 'Contribuinte individual - Diretor não empregado, com FGTS',
  ContribuinteIndivDiretorSemFgts = 'Contribuinte individual - Diretor não empregado, sem FGTS',
  ContribuinteIndivEmpresario = 'Contribuinte individual - Empresário, sócio e membro de conselho de administração ou fiscal',
  ContribuinteIndivCooperado = 'Contribuinte individual - Cooperado que presta serviços por intermédio de cooperativa de trabalho',
  ContribuinteIndivTransp = 'Contribuinte individual - Transportador cooperado que presta serviços por intermédio de cooperativa de trabalho',
  ContribuinteIndivCooperadoFiliado = 'Contribuinte individual - Cooperado filiado a cooperativa de produção',
  ContribuinteIndivMicro = 'Contribuinte individual - Microempreendedor individual',
  ContribuinteIndivMagistrado = 'Contribuinte individual - Magistrado classista temporário da Justiça do Trabalho ou da Justiça Eleitoral que seja aposentado de qualquer regime previdenciário',
  ContribuinteIndivAssociado = 'Contribuinte individual - Associado eleito para direção de cooperativa, associação ou entidade de classe de qualquer natureza ou finalidade, bem como o síndico ou administrador eleito para exercer atividade de direção condominial, desde que recebam remuneração',
  ContribuinteIndivConsTutelar = 'Contribuinte individual - Membro de conselho tutelar, nos termos da Lei 8.069/1990',
  MinistroConfissao = 'Ministro de confissão religiosa ou membro de vida consagrada, de congregação ou de ordem religiosa',
  Estagiario = 'Estagiário',
  Medico = 'Médico residente ou residente em área profissional de saúde',
  Bolsista = 'Bolsista',
  ParticipanteCurso = 'Participante de curso de formação, como etapa de concurso público, sem vínculo de emprego/estatutário',
  BeneficiarioProgNac = 'Beneficiário do Programa Nacional de Prestação de Serviço Civil Voluntário',
}

export enum GrauExpEnum {
  naoEnsejador = 1,
  ensejadorAponEsp12 = 2,
  ensejadorAponEsp09 = 3,
  ensejadorAponEsp06 = 4,
}

export enum GrauExpLabelEnum {
  naoEnsejador = 'Não ensejador de aposentadoria especial',
  ensejadorAponEsp12 = 'Ensejador de aposentadoria especial - FAE15_12% (15 anos de contribuição e alíquota de 12%)',
  ensejadorAponEsp09 = 'Ensejador de aposentadoria especial - FAE20_09% (20 anos de contribuição e alíquota de 9%)',
  ensejadorAponEsp06 = 'Ensejador de aposentadoria especial - FAE25_06% (25 anos de contribuição e alíquota de 6%)',
}

export enum NatAtividadeEnum {
  trabUrbano = 1,
  trabRural = 2,
}

export enum NatAtividadeLabelEnum {
  trabUrbano = 'Trabalho urbano',
  trabRural = 'Trabalho rural',
}

export enum MtvDesligTSVEnum {
  exoneracaoDirSemJC = '01',
  terminoMandDiretor = '02',
  exoneracaoPedDiretorNE = '03',
  exoneracaoPedDiretorNECulpa = '04',
  morteDirNE = '05',
  exoneracaoDirNEFalencia = '06',
  outros = '99',
}

export enum MtvDesligTSVLabelEnum {
  exoneracaoDirSemJC = 'Exoneração do diretor não empregado sem justa causa, por deliberação da assembleia, dos sócios cotistas ou da autoridade competente',
  terminoMandDiretor = 'Término de mandato do diretor não empregado que não tenha sido reconduzido ao cargo',
  exoneracaoPedDiretorNE = 'Exoneração a pedido de diretor não empregado',
  exoneracaoPedDiretorNECulpa = 'Exoneração do diretor não empregado por culpa recíproca ou força maior',
  morteDirNE = 'Morte do diretor não empregado',
  exoneracaoDirNEFalencia = 'Exoneração do diretor não empregado por falência, encerramento ou supressão de parte da empresa',
  outros = 'Outros',
}

export enum UndSalFixoEnum {
  hora = 1,
  dia = 2,
  semana = 3,
  quinzena = 4,
  mes = 5,
  tarefa = 6,
  naoAplicavel = 7,
}

export enum UndSalFixoLabelEnum {
  hora = 'Por hora',
  dia = 'Por dia',
  semana = 'Por semana',
  quinzena = 'Por quinzena',
  mes = 'Por mês',
  tarefa = 'Por tarefa',
  naoAplicavel = 'Não aplicável - Salário exclusivamente variável',
}
