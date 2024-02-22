import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExecuteReportEsocialBaseConferRequest } from './../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { ESocialBaseConferIrrfRetCardValuesResponse } from '../../irrf-models/ESocialBaseConferIrrfRetCardValuesResponse';
import { ESocialBaseConferRetValuesRequest } from './../../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { IrrfReportRequestParamsStoreService } from './../../../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';
import { IrrfReportParamsStoreService } from './../../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportFilterService } from './irrf-report-filter.service';

const mockRequestID = 'cad7777d-c7e3-6a4d-5c8a-dd2932d80c85';
const mockRequestIDGPE = '4a1466c2-11a7-bc27-4718-b7ccf0eaee06';
const menuContextGPE = 'gpe';
const menuContextEsocial = 'esocial';

function buildQueryParams(params: Object): string {
  return (
    '?' +
    Object.keys(params)
      .map(item => {
        return item + '=' + encodeURIComponent(params[item]);
      })
      .join('&')
  );
}

describe(IrrfReportFilterService.name, () => {
  let service: IrrfReportFilterService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IrrfReportFilterService,
        IrrfReportParamsStoreService,
        IrrfReportRequestParamsStoreService]
    });

    service = TestBed.inject(IrrfReportFilterService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it(`deve criar o serviço ${IrrfReportFilterService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${IrrfReportFilterService.prototype.postExecuteReport.name}
    deve retornar o ID da Requisição de geração do relatório quando solicitada execução nos contextos "esocial" e "gpe" corretamente`, done => {
    const mockResponsePostExecuteReport = {
      api: '/api/rh/esocial/v1/reportEsocialBaseConfer',
      data: { requestId: mockRequestID },
    };
    const mockResponsePostExecuteReportGPE = {
      api: '/api/rh/esocial/v1/GPEreportEsocialBaseConfer',
      data: { requestId: mockRequestIDGPE },
    };
    const payload: ExecuteReportEsocialBaseConferRequest = {
      companyId: 'T1|D MG 01',
      cpfNumber: [],
      differencesOnly: false,
      eSocialCategory: [],
      numberOfLines: 30,
      paymentPeriod: '202307',
      tribute: '3'
    };

    service.postExecuteReport(payload, menuContextEsocial).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "esocial" e retornar objeto com ID da Requisição corretamente')
        .toBe(mockResponsePostExecuteReport.data);
      done();
    });
    service.postExecuteReport(payload, menuContextGPE).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "gpe" e retornar objeto com ID da Requisição corretamente')
        .toBe(mockResponsePostExecuteReportGPE.data);
      done();
    });

    httpController
      .expectOne(mockResponsePostExecuteReport.api)
      .flush(mockResponsePostExecuteReport.data);
    httpController
      .expectOne(mockResponsePostExecuteReportGPE.api)
      .flush(mockResponsePostExecuteReportGPE.data);
  });

  it(`#${IrrfReportFilterService.prototype.getStatusReport.name}
    deve retornar o percentual e flag de término de conclusão do relatório nos contextos "esocial" e "gpe" corretamentequando solicitado`, done => {
    const mockResponseGetStatusReport = {
      api: '/api/rh/esocial/v1/reportEsocialBaseConfer/Status',
      data: {
        finished: true,
        percent: 100,
      },
    };
    const mockResponseGetStatusReportGPE = {
      api: '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/Status',
      data: {
        finished: true,
        percent: 100,
      },
    };
    const params = {
      companyId: 'T1|D MG 01',
      requestId: mockRequestID,
    };
    const paramsGPE = {
      companyId: 'T1|D MG 01',
      requestId: mockRequestIDGPE,
    };


    service.getStatusReport(params, menuContextEsocial).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "esocial" e retornar objeto com status de conclusão do relatório corretamente')
        .toBe(mockResponseGetStatusReport.data);
      done();
    });
    service.getStatusReport(params, menuContextGPE).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "gpe" e retornar objeto com status de conclusão do relatório corretamente')
        .toBe(mockResponseGetStatusReportGPE.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetStatusReport.api + buildQueryParams(params))
      .flush(mockResponseGetStatusReport.data);
    httpController
      .expectOne(mockResponseGetStatusReportGPE.api + buildQueryParams(params))
      .flush(mockResponseGetStatusReportGPE.data);
  });

  it(`#${IrrfReportFilterService.prototype.getIrrfRetValues.name}
    deve retornar valores a preencher para os Cards do Relatório nos contextos "esocial" e "gpe" corretamente quando solicitado`, done => {
    interface MockResponseIrrfRetValues {
      api: string;
      data: ESocialBaseConferIrrfRetCardValuesResponse | any;
    }

    const mockResponseGetIrrfRetValues: MockResponseIrrfRetValues = {
      api: '/api/rh/esocial/v1/reportEsocialBaseConfer/IrrfRetValues',
      data: {
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
      }
    };
    const mockResponseGetIrrfRetValuesGPE: MockResponseIrrfRetValues = {
      api: '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/IrrfRetValues',
      data: {
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
      }
    };
    const params: ESocialBaseConferRetValuesRequest = {
      companyId: 'T1|D MG 01',
      requestId: mockRequestID,
      synthetic: true,
      differencesOnly: false,
      page: 1,
      pageSize: 30,
      level: '0'
    };
    const paramsGPE: ESocialBaseConferRetValuesRequest = {
      companyId: 'T1|D MG 01',
      requestId: mockRequestIDGPE,
      synthetic: true,
      differencesOnly: false,
      page: 1,
      pageSize: 30,
      level: '0'
    };

    service.getIrrfRetValues(params, menuContextEsocial).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "esocial" e retornar objeto com valores da tabela do relatório corretamente')
        .toBe(mockResponseGetIrrfRetValues.data);
      done();
    });
    service.getIrrfRetValues(paramsGPE, menuContextGPE).subscribe(response => {
      expect(response)
        .withContext('deve chamar API com URL do contexto "gpe" e retornar objeto com valores da tabela do relatório corretamente')
        .toBe(mockResponseGetIrrfRetValuesGPE.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetIrrfRetValues.api + buildQueryParams(params))
      .flush(mockResponseGetIrrfRetValues.data);
    httpController
      .expectOne(mockResponseGetIrrfRetValuesGPE.api + buildQueryParams(paramsGPE))
      .flush(mockResponseGetIrrfRetValuesGPE.data);
  });

  it(`#${IrrfReportFilterService.prototype.getCompany.name}
    deve retornar a chave TAFCompany do session storage quando ERP não for DataSul corretamente`, () => {
      const companyIdMock: string = 'T1|D MG 01';

      sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify({ productLine: 'rm' }));
      sessionStorage.setItem('TAFCompany', JSON.stringify({ company_code: 'T1', branch_code: 'D MG 01' }));

      expect(companyIdMock).toEqual(service.getCompany());
  });
});
