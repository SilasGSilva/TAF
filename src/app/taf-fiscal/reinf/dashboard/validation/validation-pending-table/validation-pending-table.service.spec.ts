import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ValidationPendingService } from './validation-pending-table.service';
import { ValidationPendingTableModule } from './validation-pending-table.module';
import { ItemTableValidation } from '../../../../models/item-table-validation';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableSocialSecurityContributionValidation } from '../../../../models/item-table-social-security-contribution-validation';
import { ItemTableResourcesReceivedByTheSportsAssociationValidation } from '../../../../models/item-table-resources-received-by-the-sports-association-validation';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { SendValidationError } from 'taf-fiscal/models/send-validation-error';

xdescribe('ValidationPendingTableService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let validationPendingService: ValidationPendingService;

  let mockEventDetailResponse: {
  eventDetail: Array<ItemTableValidation|ItemTableSpecificEvent|ItemTableProcess|ItemTableResourcesReceivedByTheSportsAssociationValidation|ItemTableMarketingByFarmer|ItemTableSocialSecurityContributionValidation>
  ,hasNext: boolean};

  let mockPayload: PayloadEventsReinf;
  let mockBody: SendValidationError;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ValidationPendingTableModule
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    validationPendingService = injector.get(ValidationPendingService);
  }));

  afterEach(() => {
    window.localStorage.clear();
  });

  it('deve criar o componente', inject(
    [ValidationPendingService],
    (service: ValidationPendingService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('deve retornar os documentos da apuração quando o evento for R-1000 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-1000',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumber': '53113791',
          'status': 'notValidated',
          'branch': 'Filial BELO HOR                          ',
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '53.113.791',
          'beginingDate': '052018',
          'finishingdate': '      ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumberFormated': '270.154.448-36',
          'contactTaxNumber': '27015444836',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-1000 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-1000',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumber': '53113791',
          'status': 'Validated',
          'branch': 'Filial BELO HOR                          ',
          'typeOfInscription': '1 - CNPJ',
          'taxNumberFormated': '53.113.791',
          'beginingDate': '052018',
          'finishingdate': '      ',
          'taxClassification': '000001',
          'isMandatoryBookkeeping': '1 - Empresa obrigada a ECD',
          'isPayrollExemption': '0 - Não Aplicável',
          'hasFineExemptionAgreement': '0 - Sem acordo',
          'contact': 'JAIR DA SILVA TEIXEIRA',
          'contactTaxNumberFormated': '270.154.448-36',
          'contactTaxNumber': '27015444836',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-1070 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-1070',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'notValidated',
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'key': '10095957620188260001 ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-1070 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-1070',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'Validated',
          'courtFederatedUnit': 'SAO PAULO',
          'cityCode': '50308 - SAO PAULO',
          'beginingDate': '102018',
          'finishingDate': '      ',
          'key': '10095957620188260001 ',
          'proccesNumber': '10095957620188260001 ',
          'courtId': '003888',
          'proccesType': 'Administrativo',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2010 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2010',
      period: '032019',
      page: 1,
      pageSize: 20
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'notValidated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 661.92,
          'totalTaxes': 58.24,
          'totalTaxBase': 661.92,
          'taxNumber': '01601250000140',
          'key': 'ebac00d2-8167-e37f-230a-178cce86d01a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2010 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2010',
      period: '032019',
      page: 1,
      pageSize: 20
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'Validated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 661.92,
          'totalTaxes': 58.24,
          'totalTaxBase': 661.92,
          'taxNumber': '01601250000140',
          'key': 'ebac00d2-8167-e37f-230a-178cce86d01a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2020 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2020',
      period: '032019',
      page: 1,
      pageSize: 20
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'notValidated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 661.92,
          'totalTaxes': 58.24,
          'totalTaxBase': 661.92,
          'taxNumber': '01601250000140',
          'key': 'ebac00d2-8167-e37f-230a-178cce86d01a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2020 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2020',
      period: '032019',
      page: 1,
      pageSize: 20
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'Validated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '01.601.250/0001-40',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 661.92,
          'totalTaxes': 58.24,
          'totalTaxBase': 661.92,
          'taxNumber': '01601250000140',
          'key': 'ebac00d2-8167-e37f-230a-178cce86d01a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2030 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2030',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'notValidated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '64.722.662/0001-58',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 2000,
          'totalTaxes': 110,
          'totalTaxBase': 10000,
          'totalTransferAmount': 1000,
          'taxNumber': '64722662000158',
          'key': 'ebac00d2-8167-e37f-230a-178cce86e21a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2030 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2030',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'Validated',
          'branch': 'Filial BELO HOR                         ',
          'taxNumberFormated': '64.722.662/0001-58',
          'company': 'MILCLEAN 10',
          'totalInvoice': 2,
          'totalGrossValue': 2000,
          'totalTaxes': 110,
          'totalTaxBase': 10000,
          'totalTransferAmount': 1000,
          'taxNumber': '64722662000158',
          'key': 'ebac00d2-8167-e37f-230a-178cce86e21a',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2050 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2050',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumber': '53113791000122',
          'taxNumberFormated': '53.113.791/0001-22',
          'sociaSecurityContributionValue': 200,
          'status': 'notValidated',
          'key': '4d5df209-1d75-4faf-dab0-a2fe7500d7db',
          'totalGrossValue': 10000,
          'company': 'TOTVS SA',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2050 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2050',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'taxNumber': '53113791000122',
          'taxNumberFormated': '53.113.791/0001-22',
          'sociaSecurityContributionValue': 200,
          'status': 'Validated',
          'key': '4d5df209-1d75-4faf-dab0-a2fe7500d7db',
          'totalGrossValue': 10000,
          'company': 'TOTVS SA',
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2060 com o status pendente', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2060',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'notValidated',
          'typeOfInscription': '4',
          'companyTaxNumber': '	512229865174',
          'taxNumberFormated': '51.222.98651/74',
          'totalInvoice': 1,
          'totalGrossValue': 7000.00,
          'sociaSecurityContributionValue': 166.00,
          'sociaSecurityContributionValueSuspended': 0.00,
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

  it('deve retornar os documentos da apuração quando o evento for R-2060 com o status apurado', () => {

    mockPayload = {
      companyId: 'T1|D MG 01',
      event: 'R-2060',
      period: '032019'
    };

    mockBody = {
      registryKey: [{}]
    };

    mockEventDetailResponse = {
      eventDetail: [
        {
          'status': 'Validated',
          'typeOfInscription': '4',
          'companyTaxNumber': '	512229865174',
          'taxNumberFormated': '51.222.98651/74',
          'totalInvoice': 1,
          'totalGrossValue': 7000.00,
          'sociaSecurityContributionValue': 166.00,
          'sociaSecurityContributionValueSuspended': 0.00,
          'errors': 'errors',
        }
      ],
      hasNext: false
    };

    validationPendingService.getInfoValidationPending(mockPayload, mockBody).subscribe(response => {
      expect(response).toEqual(mockEventDetailResponse);
    });

    const req = httpMock.expectOne(
      request => request.method === 'POST'
    );
    expect(req.request.method).toBe('POST');

    req.flush(mockEventDetailResponse);

    httpMock.verify();
  });

});
