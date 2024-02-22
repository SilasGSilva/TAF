import { TestBed } from '@angular/core/testing';
import { ExecuteReportEsocialBaseConferRequest } from './../../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { IrrfReportRequestParamsStoreService } from './irrf-report-request-params-store.service';

const mockRequestParams: ExecuteReportEsocialBaseConferRequest = {
  companyId: 'T1|D MG 01',
  paymentPeriod: '202307',
  tribute: '3',
  differencesOnly: false,
  numberOfLines: 30,
  cpfNumber: ['15100534095'],
  eSocialCategory: ['101']
};

xdescribe(IrrfReportRequestParamsStoreService.name, () => {
  let service: IrrfReportRequestParamsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IrrfReportRequestParamsStoreService],
    });
    service = TestBed.inject(IrrfReportRequestParamsStoreService);
  });

  it(`deve criar o serviço ${IrrfReportRequestParamsStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${IrrfReportRequestParamsStoreService.prototype.addRequestParams.name}
    deve salvar parâmetros da requisição e recuperar essas informações salvas corretamente`, () => {
    service.addRequestParams(mockRequestParams);

    expect(service.getCurrentRequestParams())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockRequestParams);
  });

  it(`#${IrrfReportRequestParamsStoreService.prototype.resetRequestParams.name}
    deve voltar ao default todos os valores dos parâmetros anteriormente salvos corretamente`, () => {
    const mockResetRequesParams: ExecuteReportEsocialBaseConferRequest = {
      companyId: '',
      cpfNumber: '',
      eSocialCategory: [],
      paymentPeriod: '',
      registrationNumber: [],
      tribute: '',
      differencesOnly: false,
      numberOfLines: 30,
    };

    service.addRequestParams(mockRequestParams);
    service.resetRequestParams();

    expect(service.getCurrentRequestParams())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetRequesParams);
  });
});
