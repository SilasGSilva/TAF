import { IndApuracaoEnum, IndTpDeducaoEnum, TpCREnum, TpInscEnum, TpProcRetEnum, TpRendEnum } from '../../../../models/labor-process-taxes.model';
import { OptionsAnswer, TpDepEnum } from '../../../../models/labor-process.model';
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

  describe(PayloadUtils.changeOptionalValuesProcessTax.name, () => {
    it('should format a payload with optional values', () => {
      const payload = {
        companyId: 'companyId',
        branchId: 'branchId',
        userName: 'userName',
        excluidoERP: OptionsAnswer.No,
        ideProc: {
          nrProcTrab: '958745216325878',
          perApurPgto: '9999-99',
          obs: null,
        },
        ideTrab: [
          {
            cpfTrab: '19314911004',
            calcTrib: [
              {
                perRef: '9999-99',
                vrBcCpMensal: 999999999999.99,
                vrBcCp13: 999999999999.99,
                infoCRContrib: [
                  {
                    tpCR: TpCREnum.IRRFDecisaoJustica,
                    vrCR: 999999999999.99
                  },
                ],
              },
            ],
            infoCRIRRF: [
              {
                tpCR: TpCREnum.IRRFDecisaoJustica,
                vrCR: 999999999999.99,
                infoIR: {
                  vrRendTrib: 999999999999.99,
                  vrRendTrib13: 999999999999.99,
                  vrRendMoleGrave: 999999999999.99,
                  vrRendIsen65: null,
                  vrJurosMora: 999999999999.99,
                  vrRendIsenNTrib: 999999999999.99,
                  descIsenNTrib: 'Descrição do rendimento',
                  vrPrevOficial: 999999999999.99,
                },
                infoRRA: {
                  descRRA: null,
                  qtdMesesRRA: 9,
                  despProcJud: {
                    vlrDespCustas: null,
                    vlrDespAdvogados: 999999999999.99,
                  },
                  ideAdv: [
                    {
                      tpInsc: TpInscEnum.cpf,
                      nrInsc: '25496013003',
                      vlrAdv: null,
                    },
                  ],
                },
                dedDepen: [
                  {
                    tpRend: TpRendEnum.rra,
                    cpfDep: '25764957028',
                    vlrDeducao: 999999999999.99,
                  },
                ],
                penAlim: [
                  {
                    tpRend: TpRendEnum.rra,
                    cpfDep: '25764957028',
                    vlrPensao: 999999999999.99,
                  },
                ],
                infoProcRet: [
                  {
                    tpProcRet: TpProcRetEnum.administrativo,
                    nrProcRet: null,
                    codSusp: 12345678912345,
                    infoValores: [
                      {
                        indApuracao: IndApuracaoEnum.mensal,
                        vlrNRetido: 999999999999.99,
                        vlrDepJud: null,
                        vlrCmpAnoCal: 999999999999.99,
                        vlrCmpAnoAnt: 999999999999.99,
                        vlrRendSusp: 999999999999.99,
                        dedSusp: [
                          {
                            indTpDeducao: IndTpDeducaoEnum.penAlim,
                            vlrDedSusp: 999999999999.99,
                            benefPen: [
                              {
                                cpfDep: '25764957028',
                                vlrDepenSusp: 999999999999.99,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            infoIRComplem: {
              dtLaudo: '9999-99-99' as unknown as Date,
              infoDep: [
                {
                  cpfDep: '25764957028',
                  dtNascto: null,
                  nome: null,
                  depIRRF: OptionsAnswer.Yes,
                  tpDep: TpDepEnum.CompanheiroComFilho,
                  descrDep: 'descrição da dependência',
                },
              ],
            },
          },
        ],
      };
      const expectedResult = {
        companyId: 'companyId',
        branchId: 'branchId',
        userName: 'userName',
        excluidoERP: OptionsAnswer.No,
        ideProc: {
          nrProcTrab: '958745216325878',
          perApurPgto: '9999-99',
          obs: '',
        },
        ideTrab: [
          {
            cpfTrab: '19314911004',
            calcTrib: [
              {
                perRef: '9999-99',
                vrBcCpMensal: 999999999999.99,
                vrBcCp13: 999999999999.99,
                infoCRContrib: [
                  {
                    tpCR: TpCREnum.IRRFDecisaoJustica,
                    vrCR: 999999999999.99
                  },
                ],
              },
            ],
            infoCRIRRF: [
              {
                tpCR: TpCREnum.IRRFDecisaoJustica,
                vrCR: 999999999999.99,
                infoIR: {
                  vrRendTrib: 999999999999.99,
                  vrRendTrib13: 999999999999.99,
                  vrRendMoleGrave: 999999999999.99,
                  vrRendIsen65: -1,
                  vrJurosMora: 999999999999.99,
                  vrRendIsenNTrib: 999999999999.99,
                  descIsenNTrib: 'Descrição do rendimento',
                  vrPrevOficial: 999999999999.99,
                },
                infoRRA: {
                  descRRA: '',
                  qtdMesesRRA: 9,
                  despProcJud: {
                    vlrDespCustas: -1,
                    vlrDespAdvogados: 999999999999.99,
                  },
                  ideAdv: [
                    {
                      tpInsc: TpInscEnum.cpf,
                      nrInsc: '25496013003',
                      vlrAdv: -1,
                    },
                  ],
                },
                dedDepen: [
                  {
                    tpRend: TpRendEnum.rra,
                    cpfDep: '25764957028',
                    vlrDeducao: 999999999999.99,
                  },
                ],
                penAlim: [
                  {
                    tpRend: TpRendEnum.rra,
                    cpfDep: '25764957028',
                    vlrPensao: 999999999999.99,
                  },
                ],
                infoProcRet: [
                  {
                    tpProcRet: TpProcRetEnum.administrativo,
                    nrProcRet: '',
                    codSusp: 12345678912345,
                    infoValores: [
                      {
                        indApuracao: IndApuracaoEnum.mensal,
                        vlrNRetido: 999999999999.99,
                        vlrDepJud: -1,
                        vlrCmpAnoCal: 999999999999.99,
                        vlrCmpAnoAnt: 999999999999.99,
                        vlrRendSusp: 999999999999.99,
                        dedSusp: [
                          {
                            indTpDeducao: IndTpDeducaoEnum.penAlim,
                            vlrDedSusp: 999999999999.99,
                            benefPen: [
                              {
                                cpfDep: '25764957028',
                                vlrDepenSusp: 999999999999.99,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            infoIRComplem: {
              dtLaudo: '9999-99-99' as unknown as Date,
              infoDep: [
                {
                  cpfDep: '25764957028',
                  dtNascto: '' as unknown as Date,
                  nome: '',
                  depIRRF: OptionsAnswer.Yes,
                  tpDep: TpDepEnum.CompanheiroComFilho,
                  descrDep: 'descrição da dependência',
                },
              ],
            },
          },
        ],
      };

      PayloadUtils.changeOptionalValuesProcessTax(payload);

      expect(payload).toEqual(expectedResult);
    });
  });
});
