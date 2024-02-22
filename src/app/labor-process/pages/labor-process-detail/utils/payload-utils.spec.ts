import { CodCategEnum, GrauExpEnum, IndRepercEnum, MtvDesligEnum, MtvDesligTSVEnum, NatAtividadeEnum, OptionsAnswer, OrigemEnum, PensAlimEnum, TmpParcEnum, TpContrDuracaoEnum, TpInscEnum, TpRegPrevEnum, TpRegTrabEnum, TypeContract } from '../../../../models/labor-process.model';
import { PayloadUtils } from './payload-utils';

describe(PayloadUtils.name, () => {
  describe('should have default optional value properties', () => {
    it('for variable type STRING', () => {
      expect(PayloadUtils.DEFAULT_OPTIONAL_VALUE_STRING).toEqual('');
    });

    it('for variable type DATE', () => {
      expect(PayloadUtils.DEFAULT_OPTIONAL_VALUE_DATE).toEqual('');
    });

    it('for variable type NUMBER', () => {
      expect(PayloadUtils.DEFAULT_OPTIONAL_VALUE_NUMBER).toEqual(-1);
    });

    it('for variable type ARRAY', () => {
      expect(PayloadUtils.DEFAULT_OPTIONAL_VALUE_ARRAY).toEqual([]);
    });

  });

  describe(PayloadUtils.changeOptionalValuesLaborProcess.name, () => {
    it('should format a payload with optional values', () => {
      const payload = {
        companyId: 'companyId',
        branchId: 'branchId',
        userName: 'userName',
        excluidoERP: OptionsAnswer.No,
        infoProcesso: {
          ideResp: {
            tpInsc: TpInscEnum.Cpf,
            nrInsc: '01234567890',
          },
          origem: OrigemEnum.demandaSubm,
          nrProcTrab: 'nrProcTrab',
          obsProcTrab: 'obsProcTrab',
          dadosCompl: {
            infoProcJud: {
              ufVara: '1',
              dtSent: '2' as unknown as Date,
              codMunic: 1234567,
              idVara: 1234,
            },
            infoCCP: {
              dtCCP: null,
              tpCCP: null,
              cnpjCCP: null,
            },
          },
        },
        ideTrab: {
          cpfTrab: '01234567890',
          nmTrab: '1',
          dtNascto: '2003-08-23' as unknown as Date,
          infoContr: [
            {
              tpContr: TypeContract.TrabalhadorComVincComAlt,
              indContr: OptionsAnswer.Yes,
              dtAdmOrig: '2003-08-23' as unknown as Date,
              indReint: OptionsAnswer.Yes,
              indCateg: OptionsAnswer.Yes,
              indNatAtiv: OptionsAnswer.Yes,
              indMotDeslig: OptionsAnswer.Yes,
              matricula: '',
              codCateg: CodCategEnum.AgentePublico,
              dtInicio: '2003-08-23' as unknown as Date,
              ideEstab: {
                tpInsc: TpInscEnum.Cpf,
                nrInsc: '01234567890',
                infoVlr: {
                  compIni: '2003-08',
                  compFim: '2003-08',
                  indReperc: IndRepercEnum.DecisComRepercExclus,
                  indenSD: OptionsAnswer.Yes,
                  indenAbono: OptionsAnswer.Yes,
                  abono: [
                    {
                      anoBase: '2003',
                    },
                  ],
                  idePeriodo: [
                    {
                      perRef: '2003-08',
                      baseCalculo: {
                        vrBcCpMensal: 999999999999.99,
                        vrBcCp13: 999999999999.99,
                        infoAgNocivo: {
                          grauExp: GrauExpEnum.ensejadorAponEsp06,
                        },
                      },
                      infoFGTS: {
                        vrBcFGTSProcTrab: 999999999999.99,
                        vrBcFGTSSefip: 999999999999.99,
                        vrBcFGTSDecAnt: 999999999999.99,
                      },
                      baseMudCateg: {
                        codCateg: CodCategEnum.Auxiliar,
                        vrBcCPrev: 999999999999.99,
                      },
                    },
                  ],
                },
              },
              mudCategAtiv: [
                {
                  codCateg: CodCategEnum.Bolsista,
                  natAtividade: NatAtividadeEnum.trabRural,
                  dtMudCategAtiv: '2003-08-23' as unknown as Date,
                },
              ],
              unicContr: [
                {
                  matUnic: 'matUnic',
                  codCateg: CodCategEnum.BeneficiarioProgNac,
                  dtInicio: null,
                },
              ],
              infoCompl: {
                codCBO: 'codCBO',
                natAtividade: NatAtividadeEnum.trabRural,
                infoTerm: {
                  dtTerm: null,
                  mtvDesligTSV: MtvDesligTSVEnum.exoneracaoDirNEFalencia,
                },
                remuneracao: [
                  {
                    dtRemun: '2003-08-23' as unknown as Date,
                    vrSalFx: 999999999999.99,
                    undSalFixo: 9,
                    dscSalVar: null,
                  }
                ],
                infoVinc: {
                  tpRegTrab: TpRegTrabEnum.CLT,
                  tpRegPrev: TpRegPrevEnum.regimeGeral,
                  dtAdm: '2003-08-23' as unknown as Date,
                  tmpParc: TmpParcEnum.lmt25hSem,
                  duracao: {
                    tpContr: TpContrDuracaoEnum.prazoDeterminadoDias,
                    dtTerm: '2003-08-23' as unknown as Date,
                    clauAssec: null,
                    objDet: null,
                  },
                  sucessaoVinc: {
                    tpInsc: 1,
                    nrInsc: 'nrInsc',
                    matricAnt: 'matricAnt',
                    dtTransf: '2003-08-23' as unknown as Date,
                  },
                  infoDeslig: {
                    dtDeslig: '2003-08-23' as unknown as Date,
                    mtvDeslig: MtvDesligEnum.agrupamentoContratual,
                    dtProjFimAPI: '2003-08-23' as unknown as Date,
                    pensAlim: PensAlimEnum.percentEValorPensao,
                    percAliment: 100,
                    vrAlim: 999999999999.99,
                  },
                  observacoes: [
                    {
                      observacao: '',
                    },
                  ],
                },
              },
            },
          ],
        },
      };
      const expectedResult = {
        companyId: 'companyId',
        branchId: 'branchId',
        userName: 'userName',
        excluidoERP: OptionsAnswer.No,
        infoProcesso: {
          ideResp: {
            tpInsc: TpInscEnum.Cpf,
            nrInsc: '01234567890',
          },
          origem: OrigemEnum.demandaSubm,
          nrProcTrab: 'nrProcTrab',
          obsProcTrab: 'obsProcTrab',
          dadosCompl: {
            infoProcJud: {
              ufVara: '1',
              dtSent: '2' as unknown as Date,
              codMunic: 1234567,
              idVara: 1234,
            },
            infoCCP: {
              dtCCP: '',
              tpCCP: -1,
              cnpjCCP: '',
            },
          },
        },
        ideTrab: {
          cpfTrab: '01234567890',
          nmTrab: '1',
          dtNascto: '2003-08-23' as unknown as Date,
          dependente: [],
          infoContr: [
            {
              tpContr: TypeContract.TrabalhadorComVincComAlt,
              indContr: OptionsAnswer.Yes,
              dtAdmOrig: '2003-08-23' as unknown as Date,
              indReint: OptionsAnswer.Yes,
              indCateg: OptionsAnswer.Yes,
              indNatAtiv: OptionsAnswer.Yes,
              indMotDeslig: OptionsAnswer.Yes,
              matricula: '',
              codCateg: CodCategEnum.AgentePublico,
              dtInicio: '2003-08-23' as unknown as Date,
              indUnic: '',
              ideEstab: {
                tpInsc: TpInscEnum.Cpf,
                nrInsc: '01234567890',
                infoVlr: {
                  repercProc: -1,
                  vrRemun: -1,
                  vrAPI: -1,
                  vr13API: -1,
                  vrInden: -1,
                  vrBaseIndenFGTS: -1,
                  pagDiretoResc: '',
                  compIni: '2003-08',
                  compFim: '2003-08',
                  indReperc: IndRepercEnum.DecisComRepercExclus,
                  indenSD: OptionsAnswer.Yes,
                  indenAbono: OptionsAnswer.Yes,
                  abono: [
                    {
                      anoBase: '2003',
                    },
                  ],
                  idePeriodo: [
                    {
                      perRef: '2003-08',
                      baseCalculo: {
                        vrBcFgts: -1,
                        vrBcFgts13: -1,
                        vrBcCpMensal: 999999999999.99,
                        vrBcCp13: 999999999999.99,
                        infoAgNocivo: {
                          grauExp: GrauExpEnum.ensejadorAponEsp06,
                        },
                      },
                      infoFGTS: {
                        vrBcFgtsGuia: -1,
                        vrBcFgts13Guia: -1,
                        pagDireto: '',
                        vrBcFGTSProcTrab: 999999999999.99,
                        vrBcFGTSSefip: 999999999999.99,
                        vrBcFGTSDecAnt: 999999999999.99,
                      },
                      baseMudCateg: {
                        codCateg: CodCategEnum.Auxiliar,
                        vrBcCPrev: 999999999999.99,
                      },
                    },
                  ],
                },
              },
              mudCategAtiv: [
                {
                  codCateg: CodCategEnum.Bolsista,
                  natAtividade: NatAtividadeEnum.trabRural,
                  dtMudCategAtiv: '2003-08-23' as unknown as Date,
                },
              ],
              unicContr: [
                {
                  matUnic: 'matUnic',
                  codCateg: CodCategEnum.BeneficiarioProgNac,
                  dtInicio: '',
                },
              ],
              infoCompl: {
                codCBO: 'codCBO',
                natAtividade: NatAtividadeEnum.trabRural,
                infoTerm: {
                  dtTerm: '',
                  mtvDesligTSV: MtvDesligTSVEnum.exoneracaoDirNEFalencia,
                },
                remuneracao: [
                  {
                    dtRemun: '2003-08-23' as unknown as Date,
                    vrSalFx: 999999999999.99,
                    undSalFixo: 9,
                    dscSalVar: '',
                  }
                ],
                infoVinc: {
                  tpRegTrab: TpRegTrabEnum.CLT,
                  tpRegPrev: TpRegPrevEnum.regimeGeral,
                  dtAdm: '2003-08-23' as unknown as Date,
                  tmpParc: TmpParcEnum.lmt25hSem,
                  duracao: {
                    tpContr: TpContrDuracaoEnum.prazoDeterminadoDias,
                    dtTerm: '2003-08-23' as unknown as Date,
                    clauAssec: '',
                    objDet: '',
                  },
                  sucessaoVinc: {
                    tpInsc: 1,
                    nrInsc: 'nrInsc',
                    matricAnt: 'matricAnt',
                    dtTransf: '2003-08-23' as unknown as Date,
                  },
                  infoDeslig: {
                    dtDeslig: '2003-08-23' as unknown as Date,
                    mtvDeslig: MtvDesligEnum.agrupamentoContratual,
                    dtProjFimAPI: '2003-08-23' as unknown as Date,
                    pensAlim: PensAlimEnum.percentEValorPensao,
                    percAliment: 100,
                    vrAlim: 999999999999.99
                  },
                  observacoes: [
                    {
                      observacao: '',
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      PayloadUtils.changeOptionalValuesLaborProcess(payload);

      expect(payload).toEqual(expectedResult);
    });
  });
});
