import { OptionsAnswer } from '../../../../models/labor-process.model';
import { ProcessTax, IdeProc, InfoCRIRRF, InfoIR, InfoIRComplem, InfoDep, TpDepEnum, InfoRRA, IdeAdv, DespProcJud, InfoProcRet, TpProcRetEnum, InfoValores, DedSusp } from '../../../../models/labor-process-taxes.model';
import { OptionalValuesFormatterUtils } from '../../../utils/optional-values-formatter-utils';

export class PayloadUtils {  
  static readonly DEFAULT_OPTIONAL_VALUE_STRING = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_STRING;
  static readonly DEFAULT_OPTIONAL_VALUE_DATE = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_DATE;
  static readonly DEFAULT_OPTIONAL_VALUE_NUMBER = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_NUMBER;
  static readonly DEFAULT_OPTIONAL_VALUE_ARRAY = OptionalValuesFormatterUtils.DEFAULT_OPTIONAL_VALUE_ARRAY;

  public static changeOptionalValuesProcessTax(item: ProcessTax): void {
    this.changeOptionalValuesIdeTrab(item);
    this.changeOptionalValuesIdeProc(item);
  }

  private static changeOptionalValuesIdeTrab(item: ProcessTax) {
    this.changeOptionalValuesInfoCRIRRF(item);
    this.changeOptionalValuesInfoIRComplem(item);
  }

  private static changeOptionalValuesInfoCRIRRF(item: ProcessTax): void {
    const optionalValues: Partial<InfoCRIRRF> = {
      dedDepen: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
      penAlim: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
      infoProcRet: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        infoCRIRRF.dedDepen ??= optionalValues.dedDepen;
        infoCRIRRF.penAlim ??= optionalValues.penAlim;
        infoCRIRRF.infoProcRet ??= optionalValues.infoProcRet;
      });
    });

    this.changeOptionalValuesInfoIR(item);
    this.changeOptionalValuesInfoRRA(item);
    this.changeOptionalValuesInfoProcRet(item);
  }

  private static changeOptionalValuesInfoIR(item: ProcessTax): void {
    const optionalValues: Partial<InfoIR> = {
      vrRendTrib: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrRendTrib13: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrRendMoleGrave: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrRendIsen65: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrJurosMora: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vrRendIsenNTrib: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      descIsenNTrib: this.DEFAULT_OPTIONAL_VALUE_STRING,
      vrPrevOficial: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        if(infoCRIRRF.infoIR) {
          infoCRIRRF.infoIR.vrRendTrib ??= optionalValues.vrRendTrib;
          infoCRIRRF.infoIR.vrRendTrib13 ??= optionalValues.vrRendTrib13;
          infoCRIRRF.infoIR.vrRendMoleGrave ??= optionalValues.vrRendMoleGrave;
          infoCRIRRF.infoIR.vrRendIsen65 ??= optionalValues.vrRendIsen65;
          infoCRIRRF.infoIR.vrJurosMora ??= optionalValues.vrJurosMora;
          infoCRIRRF.infoIR.vrRendIsenNTrib ??= optionalValues.vrRendIsenNTrib;
          infoCRIRRF.infoIR.descIsenNTrib ??= optionalValues.descIsenNTrib;
          infoCRIRRF.infoIR.vrPrevOficial ??= optionalValues.vrPrevOficial;
        }
      });
    });
  }

  private static changeOptionalValuesInfoRRA(item: ProcessTax): void {
    const optionalValues: Partial<InfoRRA> = {
      descRRA: this.DEFAULT_OPTIONAL_VALUE_STRING,
      qtdMesesRRA: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      ideAdv: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        if (infoCRIRRF.infoRRA) {
          infoCRIRRF.infoRRA.descRRA ??= optionalValues.descRRA;
          infoCRIRRF.infoRRA.qtdMesesRRA ??= optionalValues.qtdMesesRRA;
          infoCRIRRF.infoRRA.ideAdv ??= optionalValues.ideAdv;
        }
      });
    });

    this.changeOptionalValuesDespProcJud(item);
    this.changeOptionalValuesIdeAdv(item);
  }

  private static changeOptionalValuesInfoProcRet(item: ProcessTax): void {
    const optionalValues: Partial<InfoProcRet> = {
      tpProcRet: this.DEFAULT_OPTIONAL_VALUE_NUMBER as TpProcRetEnum,
      nrProcRet: this.DEFAULT_OPTIONAL_VALUE_STRING,
      codSusp: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      infoValores: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        infoCRIRRF.infoProcRet.forEach(infoProcRet => {
          infoProcRet.tpProcRet ??= optionalValues.tpProcRet;
          infoProcRet.nrProcRet ??= optionalValues.nrProcRet;
          infoProcRet.codSusp ??= optionalValues.codSusp;
          infoProcRet.infoValores ??= optionalValues.infoValores;
        });
      });
    });

    this.changeOptionalValuesInfoValores(item);
  }

  private static changeOptionalValuesInfoValores(item: ProcessTax): void {
    const optionalValues: Partial<InfoValores> = {
      vlrNRetido: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vlrDepJud: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vlrCmpAnoCal: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vlrCmpAnoAnt: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vlrRendSusp: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      dedSusp: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        infoCRIRRF.infoProcRet.forEach(infoProcRet => {
          infoProcRet.infoValores.forEach(infoValores => {
            infoValores.vlrNRetido ??= optionalValues.vlrNRetido;
            infoValores.vlrDepJud ??= optionalValues.vlrDepJud;
            infoValores.vlrCmpAnoCal ??= optionalValues.vlrCmpAnoCal;
            infoValores.vlrCmpAnoAnt ??= optionalValues.vlrCmpAnoAnt;
            infoValores.vlrRendSusp ??= optionalValues.vlrRendSusp;
            infoValores.dedSusp ??= optionalValues.dedSusp;
          });
        });
      });
    });

    this.changeOptionalValuesDedSusp(item);
  }

  private static changeOptionalValuesDedSusp(item: ProcessTax): void {
    const optionalValues: Partial<DedSusp> = {
      vlrDedSusp: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      benefPen: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        infoCRIRRF.infoProcRet.forEach(infoProcRet => {
          infoProcRet.infoValores.forEach(infoValores => {
            infoValores.dedSusp.forEach(dedSusp => {
              dedSusp.vlrDedSusp ??= optionalValues.vlrDedSusp;
              dedSusp.benefPen ??= optionalValues.benefPen;
            });
          });
        });
      });
    });
  }

  private static changeOptionalValuesDespProcJud(item: ProcessTax): void {
    const optionalValues: Partial<DespProcJud> = {
      vlrDespCustas: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
      vlrDespAdvogados: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        if (infoCRIRRF.infoRRA?.despProcJud) {
          infoCRIRRF.infoRRA.despProcJud.vlrDespCustas ??= optionalValues.vlrDespCustas;
          infoCRIRRF.infoRRA.despProcJud.vlrDespAdvogados ??= optionalValues.vlrDespAdvogados;
        }
      });
    });
  }

  private static changeOptionalValuesIdeAdv(item: ProcessTax): void {
    const optionalValues: Partial<IdeAdv> = {
      vlrAdv: this.DEFAULT_OPTIONAL_VALUE_NUMBER,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        infoCRIRRF.infoRRA?.ideAdv.forEach(ideAdv => {
          ideAdv.vlrAdv ??= optionalValues.vlrAdv;
        });
      });
    });
  }

  private static changeOptionalValuesInfoIRComplem(item: ProcessTax): void {
    const optionalValues: Partial<InfoIRComplem> = {
      dtLaudo: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      infoDep: this.DEFAULT_OPTIONAL_VALUE_ARRAY,
    };

    item.ideTrab.forEach(ideTrab => {
      if (ideTrab.infoIRComplem) {
        ideTrab.infoIRComplem.dtLaudo ??= optionalValues.dtLaudo;
        ideTrab.infoIRComplem.infoDep ??= optionalValues.infoDep;
      }
    });

    this.changeOptionalValuesInfoDep(item);
  }

  private static changeOptionalValuesInfoDep(item: ProcessTax): void {
    const optionalValues: Partial<InfoDep> = {
      dtNascto: this.DEFAULT_OPTIONAL_VALUE_DATE as unknown as Date,
      nome: this.DEFAULT_OPTIONAL_VALUE_STRING,
      depIRRF: this.DEFAULT_OPTIONAL_VALUE_STRING as OptionsAnswer,
      tpDep: this.DEFAULT_OPTIONAL_VALUE_STRING as TpDepEnum,
      descrDep: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.ideTrab.forEach(ideTrab => {
      ideTrab.infoIRComplem?.infoDep.forEach(infoDep => {
        infoDep.dtNascto ??= optionalValues.dtNascto;
        infoDep.nome ??= optionalValues.nome;
        infoDep.depIRRF ??= optionalValues.depIRRF;
        infoDep.tpDep ??= optionalValues.tpDep;
        infoDep.descrDep ??= optionalValues.descrDep;
      });
    });
  }

  private static changeOptionalValuesIdeProc(item: ProcessTax): void {
    const optionalValues: Partial<IdeProc> = {
      obs: this.DEFAULT_OPTIONAL_VALUE_STRING,
    };

    item.ideProc.obs ??= optionalValues.obs;
  }
}
