import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { InssReportFilterLotationService } from './inss-report-filter-lotation.service';

describe(InssReportFilterLotationService.name, () => {
  let service: InssReportFilterLotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InssReportFilterLotationService,
        LiteralService
      ],
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
    });

    service = TestBed.get(InssReportFilterLotationService);

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

  it(`deve criar o serviço do ${InssReportFilterLotationService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getLotations e retornar os dados corretamente', fakeAsync(() => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      page: 1,
      pageSize: 50,
    };

    const mockGetResponse = {
      items: [
        {
          branchId: 'D MG 01 ',
          lotationCode: 'LOT 0001',
          companyId: 'T1',
          id: '000001',
          description: '',
        },
      ],
      hasNext: false,
    };

    service
      .getListLotations(mockRequest)
      .toPromise()
      .then(response => {
        expect(mockGetResponse).toEqual(response);
      });

    tick();

    expect(mockGetResponse).toBeDefined();
  }));
});
