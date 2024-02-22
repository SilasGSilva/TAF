import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferRetValuesRequest } from './../../../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { InssReportParamsStoreService } from './inss-report-params-store.service';

const mockRequestParams: ESocialBaseConferRetValuesRequest = {
  companyId: 'T1|D MG 01',
  requestId: '50d5f833-f915-d1a3-12fc-c6624f8905f4',
  synthetic: true,
  differencesOnly: false,
  page: 1,
  pageSize: 30
}

describe(InssReportParamsStoreService.name, () => {
  let service: InssReportParamsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InssReportParamsStoreService]
    });

    service = TestBed.inject(InssReportParamsStoreService);
  });

  it(`deve criar o serviço ${InssReportParamsStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${InssReportParamsStoreService.prototype.addParams.name}
    deve salvar parâmetros de requisição ao endpoint reportEsocialBaseConfer/InssRetValues e recuperar essas informações salvas corretamente`, () => {
    service.addParams(mockRequestParams);

    expect(service.getCurrentParams())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockRequestParams);
  });

  it(`#${InssReportParamsStoreService.prototype.resetCurrentParams.name}
    deve voltar ao default todos os valores dos parâmetros anteriormente salvos corretamente`, () => {
    const mockResetRequesParams: ESocialBaseConferRetValuesRequest = {
      companyId: '',
      requestId: '',
      synthetic: false,
      differencesOnly: false,
      page: 0,
      pageSize: 0,
    };

    service.addParams(mockRequestParams);
    service.resetCurrentParams();

    expect(service.getCurrentParams())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetRequesParams);
  });

  it(`#${InssReportParamsStoreService.prototype.setReportDataSave.name}
    deve salvar disparo de flag de Dados Salvos para o serviço corretamente`, () => {
    service.setReportDataSave();

    expect(service.getReportDataSave())
      .withContext('deve ter a propriedade reportDataSave como false')
      .toBeFalse();

    service.addParams(mockRequestParams);

    expect(service.getReportDataSave())
      .withContext('deve ter a propriedade reportDataSave como true')
      .toBeTrue();
  });

  it(`#${InssReportParamsStoreService.prototype.setIsConfiguredService.name}
    deve salvar envio de flag Indicando Presença de Configuração de tratamento de Legacy (V5H) para o serviço corretamente`, () => {
    service.setIsConfiguredService(false);

    expect(service.getReportDataSave())
      .withContext('deve ter a propriedade isConfiguredService como false')
      .toBeFalse();

    service.setIsConfiguredService(true);

    expect(service.getIsConfiguredService())
      .withContext('deve ter a propriedade isConfiguredService como true')
      .toBeTrue();
  });
});
