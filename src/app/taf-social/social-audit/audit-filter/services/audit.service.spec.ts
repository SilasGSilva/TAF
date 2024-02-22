import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuditExecuteRequest } from '../../social-audit-models/AuditRequest';
import { AuditEnvironmentService } from './audit-environment.service';
import { AuditService } from './audit.service';
import { AuditValuesResponse } from '../../social-audit-models/AuditValuesResponse';

const mockRequestID = '0830028c-4462-3824-bce1-5284b80122b2';

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

xdescribe(AuditService.name, () => {
  let service: AuditService = null;
  let environmentService: AuditEnvironmentService = null;
  let httpController: HttpTestingController = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditService, AuditEnvironmentService],
    }).compileComponents();

    service = TestBed.inject(AuditService);
    httpController = TestBed.inject(HttpTestingController);
    environmentService = TestBed.inject(AuditEnvironmentService);
  });

  afterEach(() => httpController.verify());

  it('Deve criar o serviço principal do Painel de Auditoria', () => {
    expect(service).toBeTruthy();
  });

  it(`#postExecuteAudit
    deve retornar o ID da Requisição de geração do relatório quando solicitada execução`, done => {
    const mockResponsePostExecuteAudit = {
      api: '/api/rh/esocial/v1/EsocialAudit',
      data: { requestId: mockRequestID },
    };
    const payload: AuditExecuteRequest = {
      companyId: 'T1|D MG 01 ',
      branches: ['D MG 01', 'D RJ 02', 'M PR 02'],
      period: '202112',
      eventCodes: ['S-1200'],
      status: '3',
      deadline: '3',
      periodFrom: '20211201',
      periodTo: '20211231',
    };

    service.postExecuteAudit(payload).subscribe(response => {
      expect(response).toBe(mockResponsePostExecuteAudit.data);
      done();
    });

    httpController
      .expectOne(mockResponsePostExecuteAudit.api)
      .flush(mockResponsePostExecuteAudit.data);
  });

  it(`#getStatusAudit
    deve retornar o percentual e flag de término de conclusão do relatório quando concluído`, done => {
    const mockResponseGetStatusAudit = {
      api: '/api/rh/esocial/v1/EsocialAudit/status',
      data: {
        finished: true,
        percent: 100,
      },
    };
    const params = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
    };

    service.getStatusAudit(params).subscribe(response => {
      expect(response).toBe(mockResponseGetStatusAudit.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetStatusAudit.api + buildQueryParams(params))
      .flush(mockResponseGetStatusAudit.data);
  });

  it(`#getChartSeriesAudit
    deve retornar a sumarização das séries que compõe o gráfico quando solicitado`, done => {
    const mockResponseGetChartSeriesAudit = {
      api: '/api/rh/esocial/v1/EsocialAudit/chartValues',
      data: {
        transmInDeadline: 0,
        transmOutDeadline: 0,
        notTransmInDeadline: 4,
        notTransmOutDeadline: 0,
      },
    };
    const params = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
    };

    service.getChartSeriesAudit(params).subscribe(response => {
      expect(response).toBe(mockResponseGetChartSeriesAudit.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetChartSeriesAudit.api + buildQueryParams(params))
      .flush(mockResponseGetChartSeriesAudit.data);
  });

  it(`#getValuesAudit
    deve retornar valores a preencher na tabela de auditoria conforme paginação quando solicitado`, done => {
    interface MockResponseGetValuesAudit {
      api: string;
      data: AuditValuesResponse;
    }

    const mockResponseGetValuesAudit: MockResponseGetValuesAudit = {
      api: '/api/rh/esocial/v1/EsocialAudit/auditValues',
      data: {
        items: [
          {
            ruleDescription: 'Apuração Mensal',
            status: '3',
            receipt: '',
            deadline: '15/01/22',
            cpf: '',
            eventDescription:
              'S-1200 - MENSAL - REMUNERAÇÃO DO TRABALHADOR VINCULADO AO REGIME GERAL DE PREVIDÊNCIA SOCIAL - RGPS',
            typeOrigin: 'INCLUSÃO',
            indApur: 'FOLHA DE PAGAMENTO MENSAL',
            dateTrans: '',
            periodEvent: '12/2021',
            name: '',
            branch: 'D MG 01',
            deadlineDescription:
              'Até o dia 15 do mês subsequente ao mês de referência do evento.',
            registration: '',
            transmissionObservation:
              'Neste evento foi utilizado a funcionalidade de ajuste de recibo, sua data de transmissão não foi informada e pode gerar divergencias.',
            establishment: '53113791000122',
            processNumber: '98504531120235002674'
          },
        ],
        hasNext: false,
      },
    };
    const params = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
      synthetic: false,
      page: 1,
      pageSize: 5,
    };

    service.getValuesAudit(params).subscribe(response => {
      expect(response).toBe(mockResponseGetValuesAudit.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetValuesAudit.api + buildQueryParams(params))
      .flush(mockResponseGetValuesAudit.data);
  });
});
