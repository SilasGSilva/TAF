import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GeneralService } from './general.service';
import { SharedModule } from 'shared/shared.module';
import { HttpService } from 'core/services/http.service';
import { General } from '../../../models/general';
import { ReinfEvents } from '../../../models/reinfEvents';

xdescribe('GeneralService', () => {
  /*let service: GeneralService;

  class MockHttpService {
    get(url: string) {
      let mockResponse;
      if (url === '/wstaf001') {
        mockResponse = {
          eventsReinfTotalizers: [],
          eventsReinfNotPeriodics: [],
          protocol2099: '',
          statusPeriod2099: 'open',
          protocol4099: '',
          statusPeriod4099: 'open',
          eventsReinf: [
            {
              totalNotValidation: 1,
              metrics: 'contribuinte',
              event: 'R-1000',
              descriptionEvent: 'Informações do contribuinte',
              monitoring: [],
              typeEvent: 2,
              total: 1,
              totalValidation: 0,
              totalInvoice: 0,
              totalMonitoring: 0,
              statusMonitoring: 0,
            },
            {
              totalNotValidation: 1,
              metrics: 'processos',
              event: 'R-1070',
              descriptionEvent: 'Tabela de processos administrativos/judiciais',
              monitoring: [
                {
                  statusCode: 0,
                  quantity: 2,
                },
              ],
              totalMonitoring: 2,
              typeEvent: 2,
              total: 2,
              statusMonitoring: 0,
              totalValidation: 1,
              totalInvoice: 0,
            },
          ],
        };
      } else {
        mockResponse = {
          eventsReinf: [
            'R-1000',
            'R-1050',
            'R-1070',
            'R-2010',
            'R-2020',
            'R-2030',
            'R-2040',
            'R-2050',
            'R-2055',
            'R-2060',
            'R-3010',
            'R-4010',
            'R-4020',
            'R-4040',
            'R-4080',
            'R-9000',
            'R-9001',
            'R-9005',
            'R-9011',
            'R-9015',
          ],
          readyBloc40: false
        };
      }
      return of(mockResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    });
    service = TestBed.inject(GeneralService);
  });

  it('deve criar o serviço do General', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar os dados dos eventos existentes no período de 03/2019', async () => {
    const mockPayload: General = {
      period: '032019',
      status: 1,
      groupType: 1,
      events: ['Todos'],
      eventType: [1],
      companyId: 'T1|D MG 01',
    };

    const mockResponse = {
      eventsReinfTotalizers: [],
      eventsReinfNotPeriodics: [],
      protocol2099: '',
      statusPeriod2099: 'open',
      protocol4099: '',
      statusPeriod4099: 'open',
      eventsReinf: [
        {
          totalNotValidation: 1,
          metrics: 'contribuinte',
          event: 'R-1000',
          descriptionEvent: 'Informações do contribuinte',
          monitoring: [],
          typeEvent: 2,
          total: 1,
          totalValidation: 0,
          totalInvoice: 0,
          totalMonitoring: 0,
          statusMonitoring: 0,
        },
        {
          totalNotValidation: 1,
          metrics: 'processos',
          event: 'R-1070',
          descriptionEvent: 'Tabela de processos administrativos/judiciais',
          monitoring: [
            {
              statusCode: 0,
              quantity: 2,
            },
          ],
          totalMonitoring: 2,
          typeEvent: 2,
          total: 2,
          statusMonitoring: 0,
          totalValidation: 1,
          totalInvoice: 0,
        },
      ],
    };

    const specResponse = await service
      .getFilterDashboard(mockPayload)
      .toPromise();
    expect(specResponse).toEqual(mockResponse);
  });

  it('deve retornar somente os eventos existentes', async () => {
    const mockResponse = {
      eventsReinf: [
        'R-1000',
        'R-1050',
        'R-1070',
        'R-2010',
        'R-2020',
        'R-2030',
        'R-2040',
        'R-2050',
        'R-2055',
        'R-2060',
        'R-3010',
        'R-4010',
        'R-4020',
        'R-4040',
        'R-4080',
        'R-9000',
        'R-9001',
        'R-9005',
        'R-9011',
        'R-9015',
      ],
    };

    const params: ReinfEvents = {
      companyId: 'T1|D MG 01',
    };

    await service.getReinfEvents(params).toPromise().then(response=>{
      expect(response).toEqual(mockResponse);
    });
  });*/
});
