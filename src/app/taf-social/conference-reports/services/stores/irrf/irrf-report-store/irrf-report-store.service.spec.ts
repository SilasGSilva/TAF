import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferIrrfRetValuesResponse } from './../../../../irrf/irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { IrrfReportStoreService } from './irrf-report-store.service';

const mockReportValues: ESocialBaseConferIrrfRetValuesResponse = {
  items: [
    {
      employees: [
        {
          cpfNumber: '07424037005',
          name: 'VEGETTA',
          period: '202307',
          totalIrrfRetention: {
            tafValue: 100,
            erpValue: 100,
            retValue: 100
          },
          divergent: false,
          warning: false
        },
        {
          cpfNumber: '33615478061',
          name: 'SASUKE CHITA',
          period: '202307',
          totalIrrfRetention: {
            tafValue: 40,
            erpValue: 100,
            retValue: 40
          },
          divergent: false,
          warning: false
        },
        {
          cpfNumber: '48274452062',
          name: 'NARUTO TOMATE',
          period: '202307',
          totalIrrfRetention: {
            tafValue: 75,
            erpValue: 75,
            retValue: 75
          },
          divergent: false,
          warning: false
        },
        {
          cpfNumber: '73743262037',
          name: 'BARBIELANDIA',
          period: '202307',
          totalIrrfRetention: {
            tafValue: 20,
            erpValue: 20,
            retValue: 20
          },
          divergent: false,
          warning: false
        }
      ]
    }
  ],
  hasNext: false
};

describe(IrrfReportStoreService.name, () => {
  let service: IrrfReportStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IrrfReportStoreService]
    });

    service = TestBed.inject(IrrfReportStoreService);
  });

  it(`deve criar o serviço ${IrrfReportStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${IrrfReportStoreService.prototype.setNewReportValues.name}
    deve salvar valores da Tabela do Relatório e recuperar essas informações salvas corretamente`, () => {
    service.setNewReportValues(mockReportValues);

    expect(service.getCurrentReportValues())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockReportValues);
  });

  it(`#${IrrfReportStoreService.prototype.resetReportValues.name}
    deve voltar ao default todos os valores da Tabela do Relatório anteriormente salvos corretamente`, () => {
    const mockResetCardValues: ESocialBaseConferIrrfRetValuesResponse = {
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
