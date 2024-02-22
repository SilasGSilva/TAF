import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, getTestBed, inject } from '@angular/core/testing';

import { ReportFilterService } from './report-filter.service';
import { ReportFilterModule } from './report-filter.module';
import { EventListing } from '../../../models/event-listing';
import { ReportListing } from '../../../models/report-listing';
import { HttpService } from 'core/services/http.service';
import { of } from 'rxjs';

xdescribe('ReportFilterService', () => {
  let service: ReportFilterService;
  let fakeEventListing: EventListing;
  let fakeReportListing: ReportListing;
  class MockHttpService {
    get(url: string): any {
      const dummyResponse = {
        eventsReinf: [{ event: 'R-2010' }],
      };

      return of(dummyResponse);
    }

    post(url: string): any {
      const dummyResponse = {
        descriptionEvent:
          'Retenção contribuição previdenciária - serviços tomados',
        hasNext: false,
        eventDetail: [
          {
            branch: '',
            cnpj: '01601250000140',
            cnpjFormated: '01.601.250/0001-40',
            company: 'MILCLEAN 10',
            totalInvoice: 1,
            totalGrossValue: 330,
            totalTaxBase: 330,
            totalTaxes: 29,
          },
        ],
      };
      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportFilterModule],
      providers: [
        ReportFilterService,
        { provide: HttpService, useClass: MockHttpService },
      ],
    });

    fakeEventListing = {
      companyId: 'T1|D MG 01 ',
      period: '032019',
    };

    fakeReportListing = {
      companyId: 'T1|D MG 01 ',
      period: '032019',
      event: 'R-2010',
    };

    service = TestBed.inject(ReportFilterService);
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('deve criar o componente', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista de eventos para o período selecionado', async () => {
    const mockResponse = {
      eventsReinf: [{ event: 'R-2010' }],
    };

    const specResponse = await service
      .getEventListing(fakeEventListing)
      .toPromise();
    expect(specResponse).toEqual(mockResponse);
  });

  it('deve retornar os documentos de apuração, segundo evento e período informados', async () => {
    const mockResponse = {
      descriptionEvent:
        'Retenção contribuição previdenciária - serviços tomados',
      hasNext: false,
      eventDetail: [
        {
          branch: '',
          cnpj: '01601250000140',
          cnpjFormated: '01.601.250/0001-40',
          company: 'MILCLEAN 10',
          totalInvoice: 1,
          totalGrossValue: 330,
          totalTaxBase: 330,
          totalTaxes: 29,
        },
      ],
    };

    const specResponse = await service
      .getReportListing(fakeReportListing)
      .toPromise();
    expect(specResponse).toEqual(mockResponse);
  });

  it('deve gravar no serviço, o último periodo informado pelo usuário', () => {
    service.setInputPeriod('032019');
    expect(window.localStorage.getItem('period')).toEqual('032019');
  });

  it('deve retornar o último periodo informado pelo usuário, gravado no serviço', () => {
    service.setInputPeriod('032019');
    expect(service.getInputPeriod()).toEqual('032019');
  });
});
