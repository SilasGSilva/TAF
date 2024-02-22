import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferInssRetValuesResponse } from './../../../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { InssReportCardStoreService } from './inss-report-card-store.service';

const mockCardValues: ESocialBaseConferInssRetValuesResponse = {
  items: [
    {
      cpfNumber: '',
      name: '',
      inssGrossValue: 828.38,
      inss13GrossValue: 0,
      familySalaryValue: 0,
      maternitySalaryValue: 0,
      maternitySalary13Value: 0,
      inssTafGrossValue: 828.38,
      inss13TafGrossValue: 0,
      familySalaryTafValue: 0,
      maternitySalaryTafValue: 0,
      maternitySalary13TafRetValue: 0,
      inssRetGrossValue: 828.38,
      inssRetDescGrossValue: 0,
      inss13RetGrossValue: 0,
      inss13DescGrossValue: 0,
      familySalaryRetValue: 0,
      maternitySalaryRetValue: 0,
      maternitySalary13RetValue: 0,
      divergent: false
    }
  ],
  hasNext: false
};

describe(InssReportCardStoreService.name, () => {
  let service: InssReportCardStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InssReportCardStoreService]
    });

    service = TestBed.inject(InssReportCardStoreService);
  });

  it(`deve criar o serviço ${InssReportCardStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${InssReportCardStoreService.prototype.setNewCardValues.name}
    deve salvar valores dos Cards e recuperar essas informações salvas corretamente`, () => {
    service.setNewCardValues(mockCardValues);

    expect(service.getCurrentCardValues())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockCardValues);
  });

  it(`#${InssReportCardStoreService.prototype.resetCardValues.name}
    deve voltar ao default todos os valores dos Cards anteriormente salvos corretamente`, () => {
    const mockResetCardValues: ESocialBaseConferInssRetValuesResponse = {
      items: [],
      hasNext: false,
    };

    service.setNewCardValues(mockCardValues);
    service.resetCardValues();

    expect(service.getCurrentCardValues())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetCardValues);
  });
});
