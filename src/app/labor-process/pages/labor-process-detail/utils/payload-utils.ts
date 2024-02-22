import { BaseCalculo, BaseMudCateg, Dependente, Duracao, IdeResp, IdeTrab, IndRepercEnum, InfoAgNocivo, InfoCCP, InfoCompl, InfoContr, InfoDeslig, InfoFGTS, InfoProcJud, InfoProcesso, InfoTerm, InfoVinc, InfoVlr, LaborProcess, MudCategAtiv, OptionsAnswer, PensAlimEnum, Remuneracao, SucessaoVinc, TpInscEnum, TpRegTrabEnum, TpDepEnum, UnicContr, CodCategEnum, GrauExpEnum, MtvDesligEnum, MtvDesligTSVEnum, NatAtividadeEnum, TmpParcEnum, TpContrDuracaoEnum, TpRegPrevEnum, TpCCPEnum } from '../../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../../utils/optional-values-formatter-utils';

export class PayloadUtils {
  static readonly DEFAULT_OPTIONAL_VALUE_STRING = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_STRING;
  static readonly DEFAULT_OPTIONAL_VALUE_DATE = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_DATE;
  static readonly DEFAULT_OPTIONAL_VALUE_NUMBER = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_NUMBER;
  static readonly DEFAULT_OPTIONAL_VALUE_ARRAY = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_ARRAY;

  public static changeOptionalValuesLaborProcess(item: LaborProcess): void {
    this.changeOptionalValuesInfoProcesso(item);
    this.changeOptionalValuesIdeTrab(item);
  }

  private static changeOptionalValuesInfoProcesso(item: LaborProcess): void {
    const optionalValues: Partial<InfoProcesso> = {
      obsProcTrab: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.infoProcesso.obsProcTrab ??= optionalValues.obsProcTrab;

    this.changeOptionalValuesIdeResp(item);
    this.changeOptionalValuesDadosCompl(item);
  }

  private static changeOptionalValuesIdeResp(item: LaborProcess): void {
    const optionalValues: Partial<IdeResp> = {
      tpInsc: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpInscEnum,
      nrInsc: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.infoProcesso.ideResp.tpInsc ??= optionalValues.tpInsc;
    item.infoProcesso.ideResp.nrInsc ??= optionalValues.nrInsc;
  }

  private static changeOptionalValuesDadosCompl(item: LaborProcess): void {
    this.changeOptionalValuesInfoProcJud(item);
    this.changeOptionalValuesInfoCCP(item);
  }

  private static changeOptionalValuesInfoProcJud(item: LaborProcess): void {
    const optionalValues: Partial<InfoProcJud> = {
      ufVara: this.DEFAULT_OPTIONAL_VALUE_STRING,
      dtSent: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      codMunic: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      idVara: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.infoProcesso.dadosCompl.infoProcJud.ufVara ??= optionalValues.ufVara;
    item.infoProcesso.dadosCompl.infoProcJud.dtSent ??= optionalValues.dtSent;
    item.infoProcesso.dadosCompl.infoProcJud.codMunic ??= optionalValues.codMunic;
    item.infoProcesso.dadosCompl.infoProcJud.idVara ??= optionalValues.idVara;
  }

  private static changeOptionalValuesInfoCCP(item: LaborProcess): void {
    const optionalValues: Partial<InfoCCP> = {
      dtCCP: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      tpCCP: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpCCPEnum,
      cnpjCCP: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.infoProcesso.dadosCompl.infoCCP.dtCCP ??= optionalValues.dtCCP;
    item.infoProcesso.dadosCompl.infoCCP.tpCCP ??= optionalValues.tpCCP;
    item.infoProcesso.dadosCompl.infoCCP.cnpjCCP ??= optionalValues.cnpjCCP;
  }

  private static changeOptionalValuesIdeTrab(item: LaborProcess): void {
    const optionalValues: Partial<IdeTrab> = {
      nmTrab: this.DEFAULT_OPTIONAL_VALUE_STRING,
      dtNascto: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      dependente: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.nmTrab ??= optionalValues.nmTrab;
    item.ideTrab.dtNascto ??= optionalValues.dtNascto;
    item.ideTrab.dependente ??= optionalValues.dependente;

    this.changeOptionalValuesDependente(item);
    this.changeOptionalValuesInfoContr(item);
  }

  private static changeOptionalValuesDependente(item: LaborProcess): void {
    const optionalValues: Partial<Dependente> = {
      cpfDep: this.DEFAULT_OPTIONAL_VALUE_STRING,
      tpDep: this.DEFAULT_OPTIONAL_VALUE_STRING as TpDepEnum,
      descDep: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.ideTrab.dependente.forEach(dependente => {
      dependente.cpfDep ??= optionalValues.cpfDep;
      dependente.tpDep ??= optionalValues.tpDep;
      dependente.descDep ??= optionalValues.descDep;
    });
  }

  private static changeOptionalValuesInfoContr(item: LaborProcess): void {
    const optionalValues: Partial<InfoContr> = {
      dtAdmOrig: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      indReint: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      indUnic: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      matricula: this.DEFAULT_OPTIONAL_VALUE_STRING,
      codCateg: this.DEFAULT_OPTIONAL_VALUE_NUMBER as CodCategEnum,
      dtInicio: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      mudCategAtiv: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
      unicContr: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.dtAdmOrig ??= optionalValues.dtAdmOrig;
      infoContr.indReint ??= optionalValues.indReint;
      infoContr.indUnic ??= optionalValues.indUnic;
      infoContr.matricula ??= optionalValues.matricula;
      infoContr.codCateg ??= optionalValues.codCateg;
      infoContr.dtInicio ??= optionalValues.dtInicio;
      infoContr.mudCategAtiv ??= optionalValues.mudCategAtiv;
      infoContr.unicContr ??= optionalValues.unicContr;
    });

    this.changeOptionalValuesIdeEstab(item);
    this.changeOptionalValuesMudCategAtiv(item);
    this.changeOptionalValuesUnicContr(item);
    this.changeOptionalValuesInfoCompl(item);
  }

  private static changeOptionalValuesIdeEstab(item: LaborProcess): void {
    this.changeOptionalValuesInfoVlr(item);
  }

  private static changeOptionalValuesInfoVlr(item: LaborProcess): void {
    const optionalValues: Partial<InfoVlr> = {
      indReperc: this.DEFAULT_OPTIONAL_VALUE_NUMBER as IndRepercEnum,
      indenSD: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      indenAbono: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      abono: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
      repercProc: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrRemun: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrAPI: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vr13API: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrInden: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBaseIndenFGTS: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      pagDiretoResc: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      idePeriodo: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.ideEstab.infoVlr.indReperc ??= optionalValues.indReperc;
      infoContr.ideEstab.infoVlr.indenSD ??= optionalValues.indenSD;
      infoContr.ideEstab.infoVlr.indenAbono ??= optionalValues.indenAbono;
      infoContr.ideEstab.infoVlr.abono ??= optionalValues.abono;
      infoContr.ideEstab.infoVlr.repercProc ??= optionalValues.repercProc;
      infoContr.ideEstab.infoVlr.vrRemun ??= optionalValues.vrRemun;
      infoContr.ideEstab.infoVlr.vrAPI ??= optionalValues.vrAPI;
      infoContr.ideEstab.infoVlr.vr13API ??= optionalValues.vr13API;
      infoContr.ideEstab.infoVlr.vrInden ??= optionalValues.vrInden;
      infoContr.ideEstab.infoVlr.vrBaseIndenFGTS ??= optionalValues.vrBaseIndenFGTS;
      infoContr.ideEstab.infoVlr.pagDiretoResc ??= optionalValues.pagDiretoResc;
      infoContr.ideEstab.infoVlr.idePeriodo ??= optionalValues.idePeriodo;
    });

    this.changeOptionalValuesIdePeriodo(item);
  }

  private static changeOptionalValuesIdePeriodo(item: LaborProcess): void {
    this.changeOptionalValuesBaseCalculo(item);
    this.changeOptionalValuesInfoFGTS(item);
    this.changeOptionalValuesBaseMudCateg(item);
  }

  private static changeOptionalValuesBaseCalculo(item: LaborProcess): void {
    const optionalValues: Partial<BaseCalculo> = {
      vrBcCpMensal: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcCp13: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFgts: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFgts13: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        idePeriodo.baseCalculo.vrBcCpMensal ??= optionalValues.vrBcCpMensal;
        idePeriodo.baseCalculo.vrBcCp13 ??= optionalValues.vrBcCp13;
        idePeriodo.baseCalculo.vrBcFgts ??= optionalValues.vrBcFgts;
        idePeriodo.baseCalculo.vrBcFgts13 ??= optionalValues.vrBcFgts13;
      });
    });

    this.changeOptionalValuesInfoAgNocivo(item);
  }

  private static changeOptionalValuesInfoAgNocivo(item: LaborProcess): void {
    const optionalValues: Partial<InfoAgNocivo> = {
      grauExp: this.DEFAULT_OPTIONAL_VALUE_NUMBER as GrauExpEnum,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        idePeriodo.baseCalculo.infoAgNocivo.grauExp ??= optionalValues.grauExp;
      });
    });
  }

  private static changeOptionalValuesInfoFGTS(item: LaborProcess): void {
    const optionalValues: Partial<InfoFGTS> = {
      vrBcFGTSProcTrab: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFGTSSefip: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFGTSDecAnt: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFgtsGuia: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrBcFgts13Guia: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      pagDireto: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        idePeriodo.infoFGTS.vrBcFGTSProcTrab ??= optionalValues.vrBcFGTSProcTrab;
        idePeriodo.infoFGTS.vrBcFGTSSefip ??= optionalValues.vrBcFGTSSefip;
        idePeriodo.infoFGTS.vrBcFGTSDecAnt ??= optionalValues.vrBcFGTSDecAnt;
        idePeriodo.infoFGTS.vrBcFgtsGuia ??= optionalValues.vrBcFgtsGuia;
        idePeriodo.infoFGTS.vrBcFgts13Guia ??= optionalValues.vrBcFgts13Guia;
        idePeriodo.infoFGTS.pagDireto ??= optionalValues.pagDireto;
      });
    });
  }

  private static changeOptionalValuesBaseMudCateg(item: LaborProcess): void {
    const optionalValues: Partial<BaseMudCateg> = {
      codCateg: this.DEFAULT_OPTIONAL_VALUE_NUMBER as CodCategEnum,
      vrBcCPrev: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        idePeriodo.baseMudCateg.codCateg ??= optionalValues.codCateg;
        idePeriodo.baseMudCateg.vrBcCPrev ??= optionalValues.vrBcCPrev;
      });
    });
  }

  private static changeOptionalValuesMudCategAtiv(item: LaborProcess): void {
    const optionalValues: Partial<MudCategAtiv> = {
      codCateg: this.DEFAULT_OPTIONAL_VALUE_NUMBER as CodCategEnum,
      natAtividade: this.DEFAULT_OPTIONAL_VALUE_NUMBER as NatAtividadeEnum,
      dtMudCategAtiv: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.mudCategAtiv.forEach(mudCategAtiv => {
        mudCategAtiv.natAtividade ??= optionalValues.natAtividade;
      });
    });
  }

  private static changeOptionalValuesUnicContr(item: LaborProcess): void {
    const optionalValues: Partial<UnicContr> = {
      matUnic: this.DEFAULT_OPTIONAL_VALUE_STRING,
      codCateg: this.DEFAULT_OPTIONAL_VALUE_NUMBER as CodCategEnum,
      dtInicio: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.unicContr.forEach(unicContr => {
        unicContr.matUnic ??= optionalValues.matUnic;
        unicContr.codCateg ??= optionalValues.codCateg;
        unicContr.dtInicio ??= optionalValues.dtInicio;
      });
    });
  }

  private static changeOptionalValuesInfoCompl(item: LaborProcess): void {
    const optionalValues: Partial<InfoCompl> = {
      codCBO: this.DEFAULT_OPTIONAL_VALUE_STRING,
      natAtividade: this.DEFAULT_OPTIONAL_VALUE_NUMBER as NatAtividadeEnum,
      remuneracao: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.codCBO ??= optionalValues.codCBO;
      infoContr.infoCompl.natAtividade ??= optionalValues.natAtividade;
      infoContr.infoCompl.remuneracao ??= optionalValues.remuneracao;
    });

    this.changeOptionalValuesRemuneracao(item);
    this.changeOptionalValuesInfoVinc(item);
    this.changeOptionalValuesInfoTerm(item);
  }

  private static changeOptionalValuesRemuneracao(item: LaborProcess): void {
    const optionalValues: Partial<Remuneracao> = {
      dscSalVar: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.remuneracao.forEach(remuneracao => {
        remuneracao.dscSalVar ??= optionalValues.dscSalVar;
      });
    });
  }

  private static changeOptionalValuesInfoVinc(item: LaborProcess): void {
    const optionalValues: Partial<InfoVinc> = {
      tpRegTrab: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpRegTrabEnum,
      tpRegPrev: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpRegPrevEnum,
      dtAdm: this.DEFAULT_OPTIONAL_VALUE_STRING as unknown as Date,
      tmpParc: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TmpParcEnum,
      observacoes: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.infoVinc.tpRegTrab ??= optionalValues.tpRegTrab;
      infoContr.infoCompl.infoVinc.tpRegPrev ??= optionalValues.tpRegPrev;
      infoContr.infoCompl.infoVinc.dtAdm ??= optionalValues.dtAdm;
      infoContr.infoCompl.infoVinc.tmpParc ??= optionalValues.tmpParc;
      infoContr.infoCompl.infoVinc.observacoes ??= optionalValues.observacoes;
    });

    this.changeOptionalValuesDuracao(item);
    this.changeOptionalValuesSucessaoVinc(item);
    this.changeOptionalValuesInfoDeslig(item);
  }

  private static changeOptionalValuesDuracao(item: LaborProcess): void {
    const optionalValues: Partial<Duracao> = {
      tpContr: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpContrDuracaoEnum,
      dtTerm: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      clauAssec: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      objDet: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.infoVinc.duracao.tpContr ??= optionalValues.tpContr;
      infoContr.infoCompl.infoVinc.duracao.dtTerm ??= optionalValues.dtTerm;
      infoContr.infoCompl.infoVinc.duracao.clauAssec ??= optionalValues.clauAssec;
      infoContr.infoCompl.infoVinc.duracao.objDet ??= optionalValues.objDet;
    });
  }

  private static changeOptionalValuesSucessaoVinc(item: LaborProcess): void {
    const optionalValues: Partial<SucessaoVinc> = {
      tpInsc: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpInscEnum,
      nrInsc: this.DEFAULT_OPTIONAL_VALUE_STRING,
      matricAnt: this.DEFAULT_OPTIONAL_VALUE_STRING,
      dtTransf: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.infoVinc.sucessaoVinc.tpInsc ??= optionalValues.tpInsc;
      infoContr.infoCompl.infoVinc.sucessaoVinc.nrInsc ??= optionalValues.nrInsc;
      infoContr.infoCompl.infoVinc.sucessaoVinc.matricAnt ??= optionalValues.matricAnt;
      infoContr.infoCompl.infoVinc.sucessaoVinc.dtTransf ??= optionalValues.dtTransf;
    });
  }

  private static changeOptionalValuesInfoDeslig(item: LaborProcess): void {
    const optionalValues: Partial<InfoDeslig> = {
      dtDeslig: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      mtvDeslig: this.DEFAULT_OPTIONAL_VALUE_STRING as MtvDesligEnum,
      dtProjFimAPI: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      pensAlim: this.DEFAULT_OPTIONAL_VALUE_NUMBER as PensAlimEnum,
      percAliment: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrAlim: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.infoVinc.infoDeslig.dtDeslig ??= optionalValues.dtDeslig;
      infoContr.infoCompl.infoVinc.infoDeslig.mtvDeslig ??= optionalValues.mtvDeslig;
      infoContr.infoCompl.infoVinc.infoDeslig.dtProjFimAPI ??= optionalValues.dtProjFimAPI;
      infoContr.infoCompl.infoVinc.infoDeslig.pensAlim ??= optionalValues.pensAlim;
      infoContr.infoCompl.infoVinc.infoDeslig.percAliment ??= optionalValues.percAliment;
      infoContr.infoCompl.infoVinc.infoDeslig.vrAlim ??= optionalValues.vrAlim;
    });
  }

  private static changeOptionalValuesInfoTerm(item: LaborProcess): void {
    const optionalValues: Partial<InfoTerm> = {
      dtTerm: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      mtvDesligTSV: this.DEFAULT_OPTIONAL_VALUE_STRING as MtvDesligTSVEnum,
    };

    item.ideTrab.infoContr.forEach(infoContr => {
      infoContr.infoCompl.infoTerm.dtTerm ??= optionalValues.dtTerm;
      infoContr.infoCompl.infoTerm.mtvDesligTSV ??= optionalValues.mtvDesligTSV;
    });
  }
}
