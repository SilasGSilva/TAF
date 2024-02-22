import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TransmissionPendingService } from './transmission-pending.service';
import { HttpService } from 'core/services/http.service';
import { ItemTable } from '../../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../../models/item-table-resources-received-by-the-sports-association';

xdescribe('TransmissionPendingService', () => {
  /*let injector: TestBed;
  let originalTimeout: number;
  let httpMock: HttpTestingController;
  let transmissionPendingService: TransmissionPendingService;
  let mockTransmissionResponse: { eventDetail: Array<ItemTable | ItemTableSpecificEvent | ItemTableProcess | ItemTableMarketingByFarmer| ItemTableSocialSecurityContribution | ItemTableResourcesReceivedByTheSportsAssociation>, hasNext: boolean };

  class MockHttpService {
    get(url: string) {
      return of(mockTransmissionResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: HttpService, useClass: MockHttpService }
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    transmissionPendingService = injector.get(TransmissionPendingService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  });

  afterEach(() => {
    httpMock.verify();
    window.localStorage.clear();
  });

  it('deve criar o serviço', inject(
    [TransmissionPendingService],
    (service: TransmissionPendingService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('deve retornar os documentos da transmissão, segundo o evento R-1000 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-1000'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01 ',
          'key': '',
          'branchTaxNumber': '53113791000122',
          'taxNumber': '37621100850',
          'taxNumberFormated': '376.211.008-50',
          'company': 'TOTVS',
          'totalInvoice': 1,
          'totalGrossValue': 1000,
          'totalTaxBase': 1000,
          'totalTaxes': 150,
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-1000 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-1000'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01 ',
          'key': '',
          'branchTaxNumber': '53113791000122',
          'taxNumber': '37621100850',
          'taxNumberFormated': '376.211.008-50',
          'company': 'TOTVS',
          'totalInvoice': 1,
          'totalGrossValue': 1000,
          'totalTaxBase': 1000,
          'totalTaxes': 150,
          'status': 'Transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-1070 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-1070'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-1070 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-1070'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2010 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2010'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2010 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2010'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2020 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2020'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2020 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2020'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'typeOfInscription': '1',
          'taxNumberFormated': '376.211.008-50',
          'taxNumber': '37621100850',
          'beginingDate': '102018',
          'finishingdate': '    ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumber': '27015444836',
          'contactTaxNumberFormated': '270.154.448-36',
          'errorId': '22',
          'protocol': '123456789',
          'status': 'Transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2030 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2030'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53113791000122',
          'taxNumber': '53113791000122',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalTaxes': 1000,
          'key': '2ce0b227-e894-c1ae-3b2a-39c160f07115',
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2030 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2030'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'taxNumberFormated': '53113791000122',
          'taxNumber': '53113791000122',
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalTaxes': 1000,
          'key': '2ce0b227-e894-c1ae-3b2a-39c160f07115',
          'status': 'transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2050 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2050'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'totalInvoice': 1,
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalTaxes': 1000,
          'key': '2ce0b227-e894-c1ae-3b2a-39c160f07115',
          'taxNumberFormated': '53.113.791/0001-22',
          'taxNumber': '53113791000122',
          'company': 'TOTVS SA',
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2050 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2050'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'branch': 'D MG 01',
          'totalInvoice': 1,
          'totalGrossValue': 1000,
          'totalReceivedWithHoldAmount': 1000,
          'totalTaxes': 1000,
          'key': '2ce0b227-e894-c1ae-3b2a-39c160f07115',
          'taxNumberFormated': '53.113.791/0001-22',
          'taxNumber': '53113791000122',
          'company': 'TOTVS SA',
          'sociaSecurityContributionValue': 200,
          'sociaSecurityContributionValueGilrat': 10,
          'sociaSecurityContributionValueSenar': 25,
          'status': 'transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2060 quando o status for pendente', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2060'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'typeOfInscription': '',
          'totalInvoice': 1,
          'companyTaxNumber': '53113791000122',
          'taxNumberFormated': '53.113.791/0001-22',
          'totalGrossValue': 1000,
          'sociaSecurityContributionValue': 1000,
          'sociaSecurityContributionValueSuspended': 1000,
          'status': 'notTransmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });

  it('deve retornar os documentos da transmissão, segundo o evento R-2060 quando o status for transmitido', () => {

    const fakeParams = {
      'companyId': 'T1|D MG 01 ',
      'period': '102019',
      'event': 'R-2060'
    };

    mockTransmissionResponse = {
      eventDetail: [
        {
          'typeOfInscription': '',
          'totalInvoice': 1,
          'companyTaxNumber': '53113791000122',
          'taxNumberFormated': '53.113.791/0001-22',
          'totalGrossValue': 1000,
          'sociaSecurityContributionValue': 1000,
          'sociaSecurityContributionValueSuspended': 1000,
          'status': 'transmitted',
        }
      ],
      hasNext: false
    };

    transmissionPendingService.getInfoTransmissionPending(fakeParams).subscribe(response => {
    expect(response).toEqual(mockTransmissionResponse);
    });
  });*/
});
