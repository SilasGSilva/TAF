import { OptionsAnswer } from './labor-process.model';

export interface ProcessWorker {
  cpfTrab: string;
  nmTrab: string;
  dtNascto: Date;
}

export interface SimpleProcessTax {
  id: string;
  nrProcTrab: string;
  perApurPagto: string;
}

export interface ProcessTax {
  excluidoERP: string;
  branchId?: string;
  companyId: string,
  userName: string;
  ideTrab: IdeTrab[];
  ideProc: IdeProc;
}

export interface IdeTrab {
  cpfTrab: string;
  nmTrab?: string;
  dtNascto?: Date;
  calcTrib: CalcTrib[];
  infoCRIRRF: InfoCRIRRF[];
  infoIRComplem: InfoIRComplem;
}

export interface CalcTrib {
  perRef: string;
  vrBcCpMensal: number;
  vrBcCp13: number;
  vrRendIRRF?: number;
  vrRendIRRF13?: number;
  infoCRContrib: InfoCRContrib[];
}

export interface InfoCRContrib {
  tpCR: TpCREnum;
  vrCR: number;
}

export interface InfoCRIRRF {
  tpCR: TpCREnum;
  vrCR: number;
  infoIR: InfoIR;
  infoRRA: InfoRRA;
  dedDepen: DedDepen[];
  penAlim: PenAlim[];
  infoProcRet: InfoProcRet[];
}

export interface InfoIR {
  vrRendTrib: number;
  vrRendTrib13: number;
  vrRendMoleGrave: number;
  vrRendIsen65: number;
  vrJurosMora: number;
  vrRendIsenNTrib: number;
  descIsenNTrib: string;
  vrPrevOficial: number;
}

export interface InfoRRA {
  descRRA: string;
  qtdMesesRRA: number;
  despProcJud: DespProcJud;
  ideAdv: IdeAdv[];
}

export interface DespProcJud {
  vlrDespCustas: number;
  vlrDespAdvogados: number;
}

export interface IdeAdv {
  tpInsc: TpInscEnum;
  nrInsc: string;
  vlrAdv: number;
}

export interface DedDepen {
  tpRend: TpRendEnum;
  cpfDep: string;
  vlrDeducao: number;
}

export interface PenAlim {
  tpRend: TpRendEnum;
  cpfDep: string;
  vlrPensao: number;
}

export interface InfoProcRet {
  tpProcRet: TpProcRetEnum;
  nrProcRet: string;
  codSusp: number;
  infoValores: InfoValores[];
}

export interface InfoValores {
  indApuracao: IndApuracaoEnum;
  vlrNRetido: number;
  vlrDepJud: number;
  vlrCmpAnoCal: number;
  vlrCmpAnoAnt: number;
  vlrRendSusp: number;
  dedSusp: DedSusp[];
}

export interface DedSusp {
  indTpDeducao: IndTpDeducaoEnum;
  vlrDedSusp: number;
  benefPen: BenefPen[];
}

export interface BenefPen {
  cpfDep: string;
  vlrDepenSusp: number;
}

export interface InfoIRComplem {
  dtLaudo: Date;
  infoDep: InfoDep[];
}

export interface InfoDep {
  cpfDep: string;
  dtNascto: Date;
  nome: string;
  depIRRF: OptionsAnswer;
  tpDep: TpDepEnum;
  descrDep: string;
}

export interface IdeProc {
  perApurPgto: string,
  obs?: string,
  nrProcTrab: string
}

export enum TpInscEnum {
  cnpj = 1,
  cpf = 2,
}

export enum TpInscLabelEnum {
  cnpj = 'CNPJ',
  cpf = 'CPF',
}

export enum TpRendEnum {
  remunMensal = 11,
  salario13 = 12,
  rra = 18,
  rendIsenNTrib = 79,
}

export enum TpRendLabelEnum {
  remunMensal = 'Remuneração mensal',
  salario13 = '13º salário',
  rra = 'RRA',
  rendIsenNTrib = 'Rendimento isento ou não tributável',
}

export enum TpProcRetEnum {
  administrativo = 1,
  judicial = 2,
}

export enum TpProcRetLabelEnum {
  administrativo = 'Administrativo',
  judicial = 'Judicial',
}

export enum IndApuracaoEnum {
  mensal = 1,
  anual = 2,
}

export enum IndApuracaoLabelEnum {
  mensal = 'Mensal',
  anual = 'Anual (13° salário)',
}

export enum IndTpDeducaoEnum {
  prevOficial = 1,
  penAlim = 5,
  dep = 7,
}

export enum IndTpDeducaoLabelEnum {
  prevOficial = 'Previdência oficial',
  penAlim = 'Pensão alimentícia',
  dep = 'Dependentes',
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

export enum TpDepLabelEnum {
  Conjuge = 'Cônjuge',
  CompanheiroComFilho = 'Companheiro(a) com o(a) qual tenha filho ou viva há mais de 5 (cinco) anos ou possua declaração de união estável',
  Filho = 'Filho(a) ou enteado(a)',
  FilhoOuEnteadoUniversitário = 'Filho(a) ou enteado(a), universitário(a) ou cursando escola técnica de 2º grau',
  IrmaoNetoBisnetoSemArrimoComGuardaJudicial = 'Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, do(a) qual detenha a guarda judicial',
  IrmaoNetoBisnetoSemArrimoUniversitario = 'Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, universitário(a) ou cursando escola técnica de 2° grau, do(a) qual detenha a guarda judicial',
  PaisAvosBisavos = 'Pais, avós e bisavós',
  MenorGuardaJudicial = 'Menor pobre do qual detenha a guarda judicial',
  PessoaIncapaz = 'A pessoa absolutamente incapaz, da qual seja tutor ou curador',
  ExConjuge = 'Ex-cônjuge',
  AgregadoOutros = 'Agregado/Outros',
}

export enum TpCREnum {
  CPPatronal = 113851,
  CPGilrat = 164651,
  CPFinanciamento = 114151,
  CPAdicional = 113852,
  CPPatronalCargo = 113854,
  CPFinanciamentoAposentadora = 114155,
  CPAdicionalInstFina = 113855,
  CPPatronalCargoEmpreg = 113858,
  CPGilRatEmpDomestico = 164659,
  CPPatronalMei = 113857,
  CPPatronalSimples = 113853,
  CPGilratSimples = 164652,
  CPAdicionalGilRat = 114152,
  CPPatronalSimplesAtivCon = 113856,
  SalarioEducacao = 117051,
  Incra = 117651,
  IncraFPAS = 117652,
  Senai = 118151,
  Sesi = 118451,
  Senac = 119151,
  Sesc = 119651,
  Sebrae = 120051,
  SebraeFPAS = 120052,
  FDEPM = 120551,
  FundoAeroviario = 120951,
  Senar = 121353,
  Sest = 121851,
  SestTrabalhador = 121852,
  SenatCargoempresa = 122151,
  SenatCargodoTrabalhador = 122152,
  Sescoop = 122551,
  CPSeguradoEmpregadoTrabAvulso = 108251,
  CPSeguradoEmpregadoContratado = 108252,
  CPSeguradEmpDomestico = 108253,
  CPSeguradoEmpContrCurtoPrazo = 108254,
  CPSeguradoEmpEmpregadorSeguradoEsp = 108255,
  CPSeguradoEmpMei = 108257,
  CPSeguradoContrInd = 109951,
  CPSeguradoContInd = 109952,
  IRRFDecisaoJustica = '593656',
  IRRFRRA = '188951',
}

export enum TpCRLabelEnum {
  CPPatronal = 'CP patronal a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPGilrat = 'CP GILRAT a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPFinanciamento = 'CP para financiamento de aposentadoria especial a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPAdicional = 'CP adicional a cargo das instituições financeiras sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPPatronalCargo = 'CP patronal a cargo da empresa sobre a remuneração do segurado contribuinte individual',
  CPFinanciamentoAposentadora = 'CP para financiamento de aposentadoria especial a cargo da empresa sobre a remuneração do segurado contribuinte individual',
  CPAdicionalInstFina = 'CP adicional a cargo das instituições financeiras sobre a remuneração do segurado contribuinte individual',
  CPPatronalCargoEmpreg = 'CP patronal a cargo do empregador doméstico sobre a remuneração do segurado empregado doméstico',
  CPGilRatEmpDomestico = 'CP GILRAT a cargo do empregador doméstico sobre a remuneração do segurado empregado doméstico',
  CPPatronalMei = 'CP patronal a cargo do Microempreendedor - MEI sobre a remuneração do segurado empregado',
  CPPatronalSimples = 'CP patronal a cargo da empresa SIMPLES com atividade concomitante sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPGilratSimples = 'CP GILRAT a cargo da empresa SIMPLES com atividade concomitante sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPAdicionalGilRat = 'CP adicional GILRAT a cargo da empresa SIMPLES com atividade concomitante sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPPatronalSimplesAtivCon = 'CP patronal a cargo da empresa SIMPLES com atividade concomitante sobre a remuneração do segurado contribuinte individual',
  SalarioEducacao = 'Salário-Educação a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Incra = 'Incra a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  IncraFPAS = 'Incra (FPAS 531/795/825) a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Senai = 'Senai a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Sesi = 'Sesi a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Senac = 'Senac a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Sesc = 'Sesc a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Sebrae = 'Sebrae a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  SebraeFPAS = 'Sebrae (FPAS 566/574/647) a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  FDEPM = 'FDEPM a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  FundoAeroviario = 'Fundo Aeroviário a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Senar = 'Senar a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  Sest = 'Sest a cargo da empresa sobre a remuneração do segurado transportador autônomo',
  SestTrabalhador = 'Sest a cargo do trabalhador (descontado pela empresa) sobre a remuneração do segurado transportador autônomo',
  SenatCargoempresa = 'Senat a cargo da empresa sobre a remuneração do segurado transportador autônomo',
  SenatCargodoTrabalhador = 'Senat a cargo do trabalhador (descontado pela empresa) sobre a remuneração do segurado transportador autônomo',
  Sescoop = 'Sescoop a cargo da empresa sobre a remuneração do segurado empregado ou trabalhador avulso',
  CPSeguradoEmpregadoTrabAvulso = 'CP do segurado empregado e trabalhador avulso',
  CPSeguradoEmpregadoContratado = 'CP do segurado empregado contratado por curto prazo - Lei 11.718/2009',
  CPSeguradEmpDomestico = 'CP do segurado empregado doméstico',
  CPSeguradoEmpContrCurtoPrazo = 'CP do segurado empregado contratado por curto prazo por empregador segurado especial - Lei 11.718/2009',
  CPSeguradoEmpEmpregadorSeguradoEsp = 'CP do segurado empregado contratado por empregador segurado especial',
  CPSeguradoEmpMei = 'CP do segurado empregado contratado por empregador MEI',
  CPSeguradoContrInd = 'CP do segurado contribuinte individual - 11%',
  CPSeguradoContInd = 'CP do segurado contribuinte individual - 20%',
  IRRFDecisaoJustica = 'IRRF - Decisão da Justiça do Trabalho',
  IRRFRRA = 'IRRF - RRA - Decisão da Justiça do Trabalho',
}

export enum TpCRInfoCRIRRFEnum {
  IRRFDecisaoJustica = '593656',
  IRRFCCPNINTER = '056152',
  IRRFRRA = '188951',
}

export enum TpCRLabelInfoCRIRRFEnum {
  IRRFDecisaoJustica = 'IRRF - Decisão da Justiça do Trabalho',
  IRRFCCPNINTER = 'IRRF - CCP/NINTER',
  IRRFRRA = 'IRRF - RRA',
}
