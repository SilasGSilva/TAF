import { TestBed } from '@angular/core/testing';
import { ESocialBaseConferRetValuesRequest } from './../../../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { IrrfReportParamsStoreService } from './irrf-report-params-store.service';

const mockRequestParams: ESocialBaseConferRetValuesRequest = {
  companyId: 'T1|D MG 01',
  requestId: 'f89c0b9b-7627-c055-f733-2dc49317d580',
  synthetic: true,
  differencesOnly: false,
  warningsOnly: false,
  page: 1,
  pageSize: 30,
  level: '0'
}

describe(IrrfReportParamsStoreService.name, () => {
  let service: IrrfReportParamsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IrrfReportParamsStoreService]
    });

    service = TestBed.inject(IrrfReportParamsStoreService);
  });

  it(`deve criar o serviço ${IrrfReportParamsStoreService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${IrrfReportParamsStoreService.prototype.addParams.name}
    deve salvar parâmetros de requisição ao endpoint reportEsocialBaseConfer/IrrfRetValues e recuperar essas informações salvas corretamente`, () => {
    service.addParams(mockRequestParams);

    expect(service.getCurrentParams())
      .withContext('deve recuperar os valores anteriormente salvos corretamente')
      .toEqual(mockRequestParams);
  });

  it(`#${IrrfReportParamsStoreService.prototype.resetCurrentParams.name}
    deve voltar ao default todos os valores dos parâmetros anteriormente salvos corretamente`, () => {
    const mockResetRequesParams: ESocialBaseConferRetValuesRequest = {
      companyId: '',
      requestId: '',
      synthetic: false,
      level: '1',
      differencesOnly: false,
      warningsOnly: false,
      page: 0,
      pageSize: 0,
    };

    service.addParams(mockRequestParams);
    service.resetCurrentParams();

    expect(service.getCurrentParams())
      .withContext('deve resetar ao default todos os valores anteriormente salvos corretamente')
      .toEqual(mockResetRequesParams);
  });

  it(`#${IrrfReportParamsStoreService.prototype.setReportDataSave.name}
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

  it(`#${IrrfReportParamsStoreService.prototype.setIsConfiguredService.name}
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
