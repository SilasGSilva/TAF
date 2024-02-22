import { FilterPipe } from './filter.pipe';
import { Audit } from './../../taf-social/social-audit/social-audit-models/Audit';
import { ESocialBaseConferInssValues } from './../../taf-social/conference-reports/conference-reports-models/ESocialBaseConferInssValues';

const mockItemsTable: Array<ESocialBaseConferInssValues | any> = [
    {
        cpfNumber: "883.385.175-34",
        name: "S2200 - BRUNO MARS",
        lotationCode: "DMG001TAF",
        esocialCategory: '101',
        esocialRegistration: '011400004820180712144044',
        branchId: '34484188000536',
        inssValue: 0,
        inssTafValue: 0,
        inssRetValue: 0,
        inssRetGrossValue: 0,
        inss13Value: 0,
        inss13TafValue: 0,
        inss13RetValue: 0,
        inss13RetGrossValue: 0,
        inssBasis: 0,
        inssTafBasis: 0,
        inssRetBasis: 0,
        inssRetSuspJudBasis: 0,
        inssRetTotalBasis: 0,
        familySalaryValue: 0,
        familySalaryTafValue: 0,
        familySalaryRetValue: 0,
        maternitySalaryValue: 0,
        maternitySalaryTafValue: 0,
        maternitySalaryRetValue: 0,
        inss13Basis: 0,
        inss13TafBasis: 0,
        inss13RetBasis: 0,
        maternitySalary13Value: 0,
        maternitySalary13TafRetValue: 0,
        maternitySalary13RetValue: 0,
        inconsistent: false,
    },
    {
        cpfNumber: "470.808.238-03",
        name: "S2300 - SILAS GOMES",
        lotationCode: "DMG002TAF",
        esocialCategory: '101',
        esocialRegistration: '011400004820180712145055',
        branchId: '34484188000537',
        inssValue: 0,
        inssTafValue: 0,
        inssRetValue: 0,
        inssRetGrossValue: 0,
        inss13Value: 0,
        inss13TafValue: 0,
        inss13RetValue: 0,
        inss13RetGrossValue: 0,
        inssBasis: 0,
        inssTafBasis: 0,
        inssRetBasis: 0,
        inssRetSuspJudBasis: 0,
        inssRetTotalBasis: 0,
        familySalaryValue: 0,
        familySalaryTafValue: 0,
        familySalaryRetValue: 0,
        maternitySalaryValue: 0,
        maternitySalaryTafValue: 0,
        maternitySalaryRetValue: 0,
        inss13Basis: 0,
        inss13TafBasis: 0,
        inss13RetBasis: 0,
        maternitySalary13Value: 0,
        maternitySalary13TafRetValue: 0,
        maternitySalary13RetValue: 0,
        inconsistent: false,
    },
    {
        cpfNumber: "491.309.680-03",
        name: "S2200 - TAF TESTE",
        lotationCode: "DMG003TAF",
        esocialCategory: '101',
        esocialRegistration: '011400004820180712145056',
        branchId: '34484188000538',
        inssValue: 0,
        inssTafValue: 0,
        inssRetValue: 0,
        inssRetGrossValue: 0,
        inss13Value: 0,
        inss13TafValue: 0,
        inss13RetValue: 0,
        inss13RetGrossValue: 0,
        inssBasis: 0,
        inssTafBasis: 0,
        inssRetBasis: 0,
        inssRetSuspJudBasis: 0,
        inssRetTotalBasis: 0,
        familySalaryValue: 0,
        familySalaryTafValue: 0,
        familySalaryRetValue: 0,
        maternitySalaryValue: 0,
        maternitySalaryTafValue: 0,
        maternitySalaryRetValue: 0,
        inss13Basis: 0,
        inss13TafBasis: 0,
        inss13RetBasis: 0,
        maternitySalary13Value: 0,
        maternitySalary13TafRetValue: 0,
        maternitySalary13RetValue: 0,
        inconsistent: false,
    },
];

xdescribe(FilterPipe.name, () => {
    let filterPipe: FilterPipe = null;

    beforeEach(() => {
        filterPipe = new FilterPipe();
    });

    it(`deve filtrar caso positivo e negativo de busca CPF`, () => {
        const mockCPF: Array<ESocialBaseConferInssValues | any> = [
            {
                cpfNumber: "883.385.175-34",
                name: "S2200 - BRUNO MARS",
                lotationCode: "DMG001TAF",
                esocialCategory: '101',
                esocialRegistration: '011400004820180712144044',
                branchId: '34484188000536',
                inssValue: 0,
                inssTafValue: 0,
                inssRetValue: 0,
                inssRetGrossValue: 0,
                inss13Value: 0,
                inss13TafValue: 0,
                inss13RetValue: 0,
                inss13RetGrossValue: 0,
                inssBasis: 0,
                inssTafBasis: 0,
                inssRetBasis: 0,
                inssRetSuspJudBasis: 0,
                inssRetTotalBasis: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                inss13Basis: 0,
                inss13TafBasis: 0,
                inss13RetBasis: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                inconsistent: false,
            },
        ];

        expect(filterPipe.transform(mockItemsTable, '883.385.175-34'))
            .withContext(
                'deve filtrar o registro com o CPF informado, com pontuação'
            )
            .toEqual(mockCPF);
        expect(filterPipe.transform(mockItemsTable, '88338517534'))
            .withContext(
                'deve filtrar o registro com o CPF informado, sem pontuação'
            )
            .toEqual(mockCPF);
        expect(filterPipe.transform(mockItemsTable, '111.111.111-11'))
            .withContext(
                'deve retornar vazio, pois o CPF informado não existe na tabela'
            )
            .toHaveSize(0);
    });

    it(`deve filtar caso positivo e negativo de busca por NOME`, () => {
        const mockName: Array<ESocialBaseConferInssValues | any> = [
            {
                cpfNumber: '883.385.175-34',
                name: 'S2200 - BRUNO MARS',
                lotationCode: 'DMG001TAF',
                esocialCategory: '101',
                esocialRegistration: '011400004820180712144044',
                branchId: '34484188000536',
                inssValue: 0,
                inssTafValue: 0,
                inssRetValue: 0,
                inssRetGrossValue: 0,
                inss13Value: 0,
                inss13TafValue: 0,
                inss13RetValue: 0,
                inss13RetGrossValue: 0,
                inssBasis: 0,
                inssTafBasis: 0,
                inssRetBasis: 0,
                inssRetSuspJudBasis: 0,
                inssRetTotalBasis: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                inss13Basis: 0,
                inss13TafBasis: 0,
                inss13RetBasis: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                inconsistent: false,
            },
        ];

        expect(filterPipe.transform(mockItemsTable, 'S2200 - BRUNO MARS'))
            .withContext(
                'deve filtrar o registro com parte inicial do NOME informdo'
            )
            .toEqual(mockName);
        expect(filterPipe.transform(mockItemsTable, 'MARS'))
            .withContext(
                'deve filtrar o registro com parte final do NOME informado'
            )
            .toEqual(mockName);
        expect(filterPipe.transform(mockItemsTable, 'RIQUELMO'))
            .withContext(
                'deve retornar vazio, pois o NOME informado não existe na tabela'
            )
            .toHaveSize(0);
    });

    it(`deve filtrar caso positivo e negativo de busca por EVENTO`, () => {
      const mockName: Array<Audit | any> = [
        {
          branch: 'D SP 01',
          cpf: '596.679.770-64',
          dateTrans: 'N/A',
          deadline: '15/01/22',
          deadlineDescription: 'Até o dia 15 do mês subsequente ao mês de referência do evento.',
          eventDescription: 'S-1280 - MENSAL - INFORMAÇÕES COMPLEMENTARES AOS EVENTOS PERIÓDICOS',
          indApur: 'FOLHA DE PAGAMENTO MENSAL',
          name: 'RODRIGO DE ALMEIDA',
          periodEvent: '12/2021',
          receipt: '1.123478965',
          registration: 'N/A',
          ruleDescription: 'Apuração Mensal',
          status: '3',
          typeOrigin: 'INCLUSÃO',
          transmissionObservation: 'Neste evento foi utilizado a funcionalidade de ajuste de recibo, sua data de transmissão não foi informada e pode gerar divergências.',
          establishment: '53113791000122',
          processNumber: '98504531120235002674',
        },
      ];

      expect(filterPipe.transform(mockItemsTable, '1280'))
        .withContext('deve filtrar o registro somente com o número do EVENTO informado')
        .toEqual(mockName);
      expect(filterPipe.transform(mockItemsTable, 'INFORMAÇÕES COMPLEMENTARES AOS EVENTOS PERIÓDICOS'))
        .withContext('deve filtrar o registro somente com a descrição do EVENTO informado')
        .toEqual(mockName);
      expect(filterPipe.transform(mockItemsTable, 'T-1280'))
        .withContext('deve retornar vazio, pois o EVENTO informado não existe na tabela')
        .toHaveSize(0);
    });
});
