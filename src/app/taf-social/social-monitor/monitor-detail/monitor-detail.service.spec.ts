import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { of } from 'rxjs';
import { EsocialDetailsErrorRequest } from '../social-monitor-models/EsocialDetailsErrorRequest';
import { EsocialDetailsErrorResponse } from '../social-monitor-models/EsocialDetailsErrorResponse';
import { EsocialDetailsFilter } from '../social-monitor-models/EsocialDetailsFilter';
import { EsocialEventDetails } from '../social-monitor-models/EsocialEventDetails';
import { MonitorDetailService } from './monitor-detail.service';

xdescribe('MonitorDetailService', () => {
  let httpTestingController: HttpTestingController;
  let service: MonitorDetailService;

  const esocialContext = 'esocial';
  const gpeContext = 'gpe';
  const mockTAFFull = true;

  class MockHttpService {
    get(url: string): any {
      const dummyResponse = {
        description: 'Error',
      };

      return of(dummyResponse);
    }

    post(url: string): any {
      const dummyResponse = {
        header: [
          {
            type: 'string',
            property: 'status',
            label: 'Status',
          },
          {
            type: 'string',
            property: 'C1E_NOME',
            label: 'Nome Razão Social',
          },
          {
            type: 'string',
            property: 'M0_CGC',
            label: 'Número de Inscrição',
          },
          {
            type: 'string',
            property: 'M0_TPINSC',
            label: 'Tipo de Inscrição',
          },
          {
            type: 'string',
            property: 'C1E_EVENTO',
            label: 'Retificação',
          },
          {
            type: 'string',
            property: 'error',
            label: '',
          },
        ],
        items: [
          {
            item: [
              {
                hasError: false,
                key: '  |S1000|000134|              |',
                columns: [
                  {
                    property: 'status',
                    value: '4',
                  },
                  {
                    property: 'C1E_NOME',
                    value:
                      'FILIAL BELO HOR                                                                                                                                                                                                             ',
                  },
                  {
                    property: 'M0_CGC',
                    value: '00718528000109',
                  },
                  {
                    property: 'M0_TPINSC',
                    value: 'CNPJ',
                  },
                  {
                    property: 'C1E_EVENTO',
                    value: 'Não',
                  },
                  {
                    property: 'error',
                    value: '',
                  },
                ],
              },
            ],
          },
        ],
        hasNext: false,
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    sessionStorage.setItem('TAFFull', JSON.stringify(mockTAFFull));

    TestBed.configureTestingModule({
      providers: [
        MonitorDetailService,
        { provide: HttpService, useClass: MockHttpService },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MonitorDetailService);
  });

  it('deve criar o serviço monitor-detail', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API getEventDetails e retornar os dados corretamente', async () => {
    const mockRequest: EsocialDetailsFilter = {
      companyCode: '',
      companyId: 'T1',
      branches: ['D MG 01', 'D RJ 02'],
      id: '',
      eventCode: 'S-2230',
      period: '202003',
      periodFrom: '202003',
      periodTo: '202003',
      status: '1',
      userId: '000001',
      keys: ['12345'],
    };

    const mockResponse: EsocialEventDetails = {
      header: [
        {
          type: 'string',
          property: 'status',
          label: 'Status',
        },
        {
          type: 'string',
          property: 'C1E_NOME',
          label: 'Nome Razão Social',
        },
        {
          type: 'string',
          property: 'M0_CGC',
          label: 'Número de Inscrição',
        },
        {
          type: 'string',
          property: 'M0_TPINSC',
          label: 'Tipo de Inscrição',
        },
        {
          type: 'string',
          property: 'C1E_EVENTO',
          label: 'Retificação',
        },
        {
          type: 'string',
          property: 'error',
          label: '',
        },
      ],
      items: [
        {
          item: [
            {
              hasError: false,
              key: '  |S1000|000134|              |',
              columns: [
                {
                  property: 'status',
                  value: '4',
                },
                {
                  property: 'C1E_NOME',
                  value:
                    'FILIAL BELO HOR                                                                                                                                                                                                             ',
                },
                {
                  property: 'M0_CGC',
                  value: '00718528000109',
                },
                {
                  property: 'M0_TPINSC',
                  value: 'CNPJ',
                },
                {
                  property: 'C1E_EVENTO',
                  value: 'Não',
                },
                {
                  property: 'error',
                  value: '',
                },
              ],
            },
          ],
        },
      ],
      hasNext: false,
    };

    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

    const specResponseEsocial = await service
      .getEventDetails(mockRequest, esocialContext, isTAFFull)
      .toPromise();
    expect(specResponseEsocial).toEqual(mockResponse);

    const specResponseGPE = await service
      .getEventDetails(mockRequest, gpeContext, isTAFFull)
      .toPromise();
    expect(specResponseGPE).toEqual(mockResponse);
  });

  it('deve chamar a API getDetailsError e retornar os dados corretamente', async () => {
    const mockRequest: EsocialDetailsErrorRequest = {
      companyId: 'T1D MG 01',
      key: 'TAF12345',
      eventCode: 'S-1000',
    };

    const mockDetailTransmission: EsocialDetailsErrorResponse = {
      description: 'Error',
    };

    const isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

    const specResponseEsocial = await service
      .getDetailsError(mockRequest, esocialContext, isTAFFull)
      .toPromise();
    expect(specResponseEsocial).toEqual(mockDetailTransmission);

    const specResponseGPE = await service
      .getDetailsError(mockRequest, gpeContext, isTAFFull)
      .toPromise();
    expect(specResponseGPE).toEqual(mockDetailTransmission);
  });
});
