import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LiteralService } from 'core/i18n/literal.service';
import { CoreModule } from 'core/core.module';
import { EstablishmentReportFilterService } from './inss-report-filter-establishment.service';

describe(EstablishmentReportFilterService.name, () => {
  let service: EstablishmentReportFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstablishmentReportFilterService, LiteralService],
      imports: [HttpClientTestingModule, CoreModule],
    });

    service = TestBed.get(EstablishmentReportFilterService);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);

    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };

    const config = JSON.stringify(ERPAPPCONFIG);

    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('ERPAPPCONFIG', config);
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it(`deve criar o serviço de ${EstablishmentReportFilterService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getListEstablishment e retornar os dados corretamente', fakeAsync(() => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      page: 1,
      pageSize: 50,
    };

    const mockGetResponse = {
      items: [
        {
          registrationNumber: '53113791000122',
          companyId: 'T1',
          registrationType: '1',
        },
        {
          registrationNumber: '53113791000203',
          companyId: 'T1',
          registrationType: '1',
        },
      ],
      hasNext: false,
    };

    service.getListEstablishment(mockRequest).subscribe(response => {
      expect(mockGetResponse).toEqual(response);
    });

    tick();

    expect(mockGetResponse).toBeDefined();
  }));
});
