import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferIrrfRetCardValuesResponse } from './../../../../irrf/irrf-models/ESocialBaseConferIrrfRetCardValuesResponse';
import { IrrfReportCardStoreService } from './irrf-report-card-store.service';

const mockCardValues: ESocialBaseConferIrrfRetCardValuesResponse = {
  items: [
    {
      totalIRRFCompany: {
        tafValue: 235,
        erpValue: 235,
        retValue: 235
      }
    }
  ],
  hasNext: false
};

describe(IrrfReportCardStoreService.name, () => {
  let service: IrrfReportCardStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IrrfReportCardStoreService]
    });

    service = TestBed.inject(IrrfReportCardStoreService);
  });

  it(`deve criar o serviço ${IrrfReportCardStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${IrrfReportCardStoreService.prototype.setNewCardValues.name}
    deve salvar valores dos Cards e recuperar essas informações salvas corretamente`, () => {
    service.setNewCardValues(mockCardValues);

    expect(service.getCurrentCardValues())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockCardValues);
  });

  it(`#${IrrfReportCardStoreService.prototype.resetCardValues.name}
    deve voltar ao default todos os valores dos Cards anteriormente salvos corretamente`, () => {
    const mockResetCardValues: ESocialBaseConferIrrfRetCardValuesResponse = {
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
