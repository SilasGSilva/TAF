import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferInssRetValuesResponse } from './../../../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { InssReportStoreService } from './inss-report-store.service';

const mockReportValues: ESocialBaseConferInssRetValuesResponse = {
  items: [
    {
      cpfNumber: '11716992710',
      name: 'ANDRE LUIZ RODRIGUES NEVES',
      inssGrossValue: 0,
      inssTafGrossValue: 828.38,
      inss13GrossValue: 0,
      inss13TafGrossValue: 0,
      familySalaryValue: 0,
      familySalaryTafValue: 0,
      maternitySalaryValue: 0,
      maternitySalaryTafValue: 0,
      maternitySalary13Value: 0,
      maternitySalary13TafRetValue: 0,
      familySalaryRetValue: 0,
      maternitySalaryRetValue: 0,
      maternitySalary13RetValue: 0,
      inssRetGrossValue: 0,
      inssRetDescGrossValue: 0,
      inss13RetGrossValue: 0,
      inss13DescGrossValue: 0,
      divergent: true
    },
    {
      cpfNumber: '94451124077',
      name: 'MANO BROWN',
      inssGrossValue: 950.69,
      inssTafGrossValue: 0,
      inss13GrossValue: 0,
      inss13TafGrossValue: 0,
      familySalaryValue: 0,
      familySalaryTafValue: 0,
      maternitySalaryValue: 0,
      maternitySalaryTafValue: 0,
      maternitySalary13Value: 0,
      maternitySalary13TafRetValue: 0,
      familySalaryRetValue: 0,
      maternitySalaryRetValue: 0,
      maternitySalary13RetValue: 0,
      inssRetGrossValue: 0,
      inssRetDescGrossValue: 0,
      inss13RetGrossValue: 0,
      inss13DescGrossValue: 0,
      divergent: false
    },
    {
      cpfNumber: '25266748087',
      name: 'TRABALHADOR PRELIMINAR',
      inssGrossValue: 0,
      inssTafGrossValue: 250.69,
      inss13GrossValue: 0,
      inss13TafGrossValue: 0,
      familySalaryValue: 0,
      familySalaryTafValue: 0,
      maternitySalaryValue: 0,
      maternitySalaryTafValue: 0,
      maternitySalary13Value: 0,
      maternitySalary13TafRetValue: 0,
      familySalaryRetValue: 0,
      maternitySalaryRetValue: 0,
      maternitySalary13RetValue: 0,
      inssRetGrossValue: 0,
      inssRetDescGrossValue: 0,
      inss13RetGrossValue: 0,
      inss13DescGrossValue: 0,
      divergent: false
    },
    {
      cpfNumber: '94049760088',
      name: 'ED ROCKY',
      inssGrossValue: 0,
      inssTafGrossValue: 120.56,
      inss13GrossValue: 0,
      inss13TafGrossValue: 0,
      familySalaryValue: 0,
      familySalaryTafValue: 0,
      maternitySalaryValue: 0,
      maternitySalaryTafValue: 0,
      maternitySalary13Value: 0,
      maternitySalary13TafRetValue: 0,
      familySalaryRetValue: 0,
      maternitySalaryRetValue: 0,
      maternitySalary13RetValue: 0,
      inssRetGrossValue: 0,
      inssRetDescGrossValue: 0,
      inss13RetGrossValue: 0,
      inss13DescGrossValue: 0,
      divergent: false
    }
  ],
  hasNext: false
};

describe(InssReportStoreService.name, () => {
  let service: InssReportStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InssReportStoreService]
    });

    service = TestBed.inject(InssReportStoreService);
  });

  it(`deve criar o serviço ${InssReportStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${InssReportStoreService.prototype.setNewReportValues.name}
    deve salvar valores da Tabela do Relatório e recuperar essas informações salvas corretamente`, () => {
    service.setNewReportValues(mockReportValues);

    expect(service.getCurrentReportValues())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockReportValues);
  });

  it(`#${InssReportStoreService.prototype.resetReportValues.name}
    deve voltar ao default todos os valores da Tabela do Relatório anteriormente salvos corretamente`, () => {
    const mockResetCardValues: ESocialBaseConferInssRetValuesResponse = {
      items: [],
      hasNext: false,
    };

    service.setNewReportValues(mockReportValues);
    service.resetReportValues();

    expect(service.getCurrentReportValues())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetCardValues);
  });
});
