import { TpCREnum, TpCRLabelEnum } from '../../../../../../models/labor-process-taxes.model';

export const COLUMNS = [
  {
    label: 'Código de Receita',
    property: 'codigoReceitaLabel',
    width: '80%',
  },
  {
    label: 'Valor',
    property: 'valorLabel',
    width: '20%',
    type: 'currency',
    format: 'BRL'
  },
];

export const OPTIONS_TP_CR = [
  {
    label: TpCRLabelEnum.CPPatronal,
    value: TpCREnum.CPPatronal,
  },
  {
    label: TpCRLabelEnum.CPGilrat,
    value: TpCREnum.CPGilrat,
  },
  {
    label: TpCRLabelEnum.CPFinanciamento,
    value: TpCREnum.CPFinanciamento,
  },
  {
    label: TpCRLabelEnum.CPAdicional,
    value: TpCREnum.CPAdicional,
  },
  {
    label: TpCRLabelEnum.CPPatronalCargo,
    value: TpCREnum.CPPatronalCargo,
  },
  {
    label: TpCRLabelEnum.CPFinanciamentoAposentadora,
    value: TpCREnum.CPFinanciamentoAposentadora,
  },
  {
    label: TpCRLabelEnum.CPAdicionalInstFina,
    value: TpCREnum.CPAdicionalInstFina,
  },
  {
    label: TpCRLabelEnum.CPPatronalCargoEmpreg,
    value: TpCREnum.CPPatronalCargoEmpreg,
  },
  {
    label: TpCRLabelEnum.CPGilRatEmpDomestico,
    value: TpCREnum.CPGilRatEmpDomestico,
  },
  {
    label: TpCRLabelEnum.CPPatronalMei,
    value: TpCREnum.CPPatronalMei,
  },
  {
    label: TpCRLabelEnum.CPPatronalSimples,
    value: TpCREnum.CPPatronalSimples,
  },
  {
    label: TpCRLabelEnum.CPGilratSimples,
    value: TpCREnum.CPGilratSimples,
  },
  {
    label: TpCRLabelEnum.CPAdicionalGilRat,
    value: TpCREnum.CPAdicionalGilRat,
  },
  {
    label: TpCRLabelEnum.CPPatronalSimplesAtivCon,
    value: TpCREnum.CPPatronalSimplesAtivCon,
  },
  {
    label: TpCRLabelEnum.SalarioEducacao,
    value: TpCREnum.SalarioEducacao,
  },
  {
    label: TpCRLabelEnum.Incra,
    value: TpCREnum.Incra,
  },
  {
    label: TpCRLabelEnum.IncraFPAS,
    value: TpCREnum.IncraFPAS,
  },
  {
    label: TpCRLabelEnum.Senai,
    value: TpCREnum.Senai,
  },
  {
    label: TpCRLabelEnum.Sesi,
    value: TpCREnum.Sesi,
  },
  {
    label: TpCRLabelEnum.Senac,
    value: TpCREnum.Senac,
  },
  {
    label: TpCRLabelEnum.Sesc,
    value: TpCREnum.Sesc,
  },
  {
    label: TpCRLabelEnum.Sebrae,
    value: TpCREnum.Sebrae,
  },

  {
    label: TpCRLabelEnum.SebraeFPAS,
    value: TpCREnum.SebraeFPAS,
  },
  {
    label: TpCRLabelEnum.FDEPM,
    value: TpCREnum.FDEPM,
  },
  {
    label: TpCRLabelEnum.FundoAeroviario,
    value: TpCREnum.FundoAeroviario,
  },
  {
    label: TpCRLabelEnum.Senar,
    value: TpCREnum.Senar,
  },
  {
    label: TpCRLabelEnum.Sest,
    value: TpCREnum.Sest,
  },
  {
    label: TpCRLabelEnum.SestTrabalhador,
    value: TpCREnum.SestTrabalhador,
  },
  {
    label: TpCRLabelEnum.SenatCargoempresa,
    value: TpCREnum.SenatCargoempresa,
  },
  {
    label: TpCRLabelEnum.SenatCargodoTrabalhador,
    value: TpCREnum.SenatCargodoTrabalhador,
  },
  {
    label: TpCRLabelEnum.Sescoop,
    value: TpCREnum.Sescoop,
  },
  {
    label: TpCRLabelEnum.CPSeguradoEmpregadoTrabAvulso,
    value: TpCREnum.CPSeguradoEmpregadoTrabAvulso,
  },
  {
    label: TpCRLabelEnum.CPSeguradoEmpregadoContratado,
    value: TpCREnum.CPSeguradoEmpregadoContratado,
  },
  {
    label: TpCRLabelEnum.CPSeguradEmpDomestico,
    value: TpCREnum.CPSeguradEmpDomestico,
  },
  {
    label: TpCRLabelEnum.CPSeguradoEmpContrCurtoPrazo,
    value: TpCREnum.CPSeguradoEmpContrCurtoPrazo,
  },
  {
    label: TpCRLabelEnum.CPSeguradoEmpEmpregadorSeguradoEsp,
    value: TpCREnum.CPSeguradoEmpEmpregadorSeguradoEsp,
  },
  {
    label: TpCRLabelEnum.CPSeguradoEmpMei,
    value: TpCREnum.CPSeguradoEmpMei,
  },
  {
    label: TpCRLabelEnum.CPSeguradoContrInd,
    value: TpCREnum.CPSeguradoContrInd,
  },
  {
    label: TpCRLabelEnum.CPSeguradoContInd,
    value: TpCREnum.CPSeguradoContInd,
  },
];
