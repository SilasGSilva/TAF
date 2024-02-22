import { TestBed } from '@angular/core/testing';
import { ExecuteReportEsocialBaseConferRequest } from './../../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { InssReportRequestParamsStoreService } from './inss-report-request-params-store.service';

const mockRequestParams: ExecuteReportEsocialBaseConferRequest = {
  companyId: 'T1|D MG 01',
  paymentPeriod: '202307',
  registrationNumber: ['53113791000122'],
  tribute: '1',
  differencesOnly: false,
  numberOfLines: 30,
  lotationCode: ['TRAKINAS'],
  cpfNumber: ['15100534095'],
  eSocialCategory: ['101'],
  eSocialRegistration: ['MATJOAO001']
};

describe(InssReportRequestParamsStoreService.name, () => {
  let service: InssReportRequestParamsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InssReportRequestParamsStoreService],
    });
    service = TestBed.inject(InssReportRequestParamsStoreService);
  });

  it(`deve criar o serviço ${InssReportRequestParamsStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${InssReportRequestParamsStoreService.prototype.addRequestParams.name}
    deve salvar parâmetros da requisição e recuperar essas informações salvas corretamente`, () => {
    service.addRequestParams(mockRequestParams);

    expect(service.getCurrentRequestParams())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockRequestParams);
  });

  it(`#${InssReportRequestParamsStoreService.prototype.resetRequestParams.name}
    deve voltar ao default todos os valores dos parâmetros anteriormente salvos corretamente`, () => {
    const mockResetRequesParams: ExecuteReportEsocialBaseConferRequest = {
      companyId: '',
      cpfNumber: '',
      eSocialCategory: [],
      eSocialRegistration: '',
      lotationCode: [],
      paymentPeriod: '',
      registrationNumber: [],
      tribute: '',
      differencesOnly: false,
      numberOfLines: 30,
    }

    service.addRequestParams(mockRequestParams);
    service.resetRequestParams();

    expect(service.getCurrentRequestParams())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetRequesParams);
  });
});
