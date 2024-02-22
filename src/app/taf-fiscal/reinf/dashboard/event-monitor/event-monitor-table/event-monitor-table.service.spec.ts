import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { EventMonitorTableService } from './event-monitor-table.service';
import { EventMonitorTableModule } from './event-monitor-table.module';
import { ItemTableMonitor } from '../../../../models/item-table-monitor';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableTaxPayer } from './item-table-tax-payer';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSociaSecurityContribution } from './item-table-socia-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from './item-table-resources-received-by-the-sports-association';

xdescribe('EventMonitorTableService', () => {
  let injector: TestBed;
  let originalTimeout: number;
  let httpMock: HttpTestingController;
  let eventMonitorTableService: EventMonitorTableService;
  let mockEventDetailResponse: { eventDetail: Array<ItemTableMonitor | ItemTableTaxPayer | ItemTableProcess | ItemTableMarketingByFarmer | ItemTableSociaSecurityContribution | ItemTableResourcesReceivedByTheSportsAssociation>};

  class MockHttpService {
    get(url: string) {
      return of(mockEventDetailResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        EventMonitorTableModule
      ],
      providers: [
        { provide: HttpService, useClass: MockHttpService }
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    eventMonitorTableService = injector.get(EventMonitorTableService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('deve criar o componente', inject(
    [EventMonitorTableService],
    (service: EventMonitorTableService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2010 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-2010',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2010 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-2010',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2010 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2010',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2010 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2010',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2020 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-2020',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2020 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-2020',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2020 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2020',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2020 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2020',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalGrossValue': 1000,
          'totalTaxes': 29.12,
          'totalTaxBase': 330.96,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2030 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2030',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '54.216.964/0001-09',
          'branchTaxNumber': '54216964000109',
          'company': 'D MG 01 ',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalValueOfRetentionWithSuspendedLiability': 1000,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2030 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2030',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '54.216.964/0001-09',
          'branchTaxNumber': '54216964000109',
          'company': 'D MG 01 ',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalValueOfRetentionWithSuspendedLiability': 1000,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2040 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2040',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '54.216.964/0001-09',
          'branchTaxNumber': '54216964000109',
          'company': 'D MG 01 ',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalValueOfRetentionWithSuspendedLiability': 1000,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2040 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2040',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '54.216.964/0001-09',
          'branchTaxNumber': '54216964000109',
          'company': 'D MG 01 ',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalValueOfRetentionWithSuspendedLiability': 1000,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2050 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-2050',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53.113.791/0001-22',
          'company': 'TOTVS SA',
          'totalGrossValue': 10000,
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2050 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-2050',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53.113.791/0001-22',
          'company': 'TOTVS SA',
          'totalGrossValue': 10000,
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2050 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2050',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53.113.791/0001-22',
          'company': 'TOTVS SA',
          'totalGrossValue': 10000,
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2050 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2050',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53.113.791/0001-22',
          'company': 'TOTVS SA',
          'totalGrossValue': 10000,
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2060 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-2060',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '07.363.764/0001-90',
          'companyTaxNumber': '07363764000190',
          'totalGrossValue': 10500.00,
          'sociaSecurityContributionValue': 198.00,
          'socialSecurityContributionValueSuspended': 0.00,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2060 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-2060',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '07.363.764/0001-90',
          'companyTaxNumber': '07363764000190',
          'totalGrossValue': 10500.00,
          'sociaSecurityContributionValue': 198.00,
          'socialSecurityContributionValueSuspended': 0.00,
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2060 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-2060',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '07.363.764/0001-90',
          'companyTaxNumber': '07363764000190',
          'totalGrossValue': 10500.00,
          'sociaSecurityContributionValue': 198.00,
          'socialSecurityContributionValueSuspended': 0.00,
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-2060 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-2060',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '07.363.764/0001-90',
          'companyTaxNumber': '07363764000190',
          'totalGrossValue': 10500.00,
          'sociaSecurityContributionValue': 198.00,
          'socialSecurityContributionValueSuspended': 0.00,
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-3010 quando o status for transmitido', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'transmitted',
      event: 'R-3010',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for aguardando governo', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'waitingReturn',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for rejeitado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'rejected',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errorId': '22',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });

  it('deve retornar os documentos do monitoramento, segundo o evento R-1070 quando o status for autorizado', () => {

    const fakeEventMonitorTable = {
      companyId: 'T1|D MG 01',
      status: 'authorized',
      event: 'R-1070',
      period: '032019'
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'protocol': 'ADKAD-9990-3929-HGF',
          'errors': 'Erros'
        }
      ]
    };

    eventMonitorTableService.getInfoEventMonitor(fakeEventMonitorTable).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });
  });
});
