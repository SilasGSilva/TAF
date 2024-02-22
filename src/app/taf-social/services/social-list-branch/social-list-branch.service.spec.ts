import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CoreModule } from '../../../core/core.module';
import { LiteralService } from '../../../core/i18n/literal.service';
import { SocialListBranchService } from './social-list-branch.service';

xdescribe('SocialListBranchService', () => {
  let httpTestingController: HttpTestingController;
  let service: SocialListBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialListBranchService, LiteralService],
      imports: [HttpClientTestingModule, CoreModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SocialListBranchService);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const tafFull = true;
    const tafContext = 'esocial';
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
    sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    sessionStorage.setItem('TAFContext', tafContext);
    sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(ERPAPPCONFIG));
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('deve criar o serviços de filtro de filiais', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getListEstablishment e retornar os dados corretamente', fakeAsync(() => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      page: 2,
      pageSize: 5,
    };

    const mockGetResponse = {
      items: [
        {
          branchCode: 'M PR 02',
          branchDescription: ' CASCAVEL',
        },
        {
          branchCode: 'M SP 01',
          branchDescription: ' SAO PAULO',
        },
        {
          branchCode: 'M SP 02',
          branchDescription: ' CAMPINAS',
        },
      ],
      hasNext: false,
    };

    sessionStorage.setItem('TAFContext', 'esocial');

    service
      .getListBranchs(mockRequest)
      .toPromise()
      .then(response => {
        expect(mockGetResponse).toEqual(response);
      });

    tick();

    expect(mockGetResponse).toBeDefined();

    sessionStorage.setItem('TAFContext', 'gpe');

    service
      .getListBranchs(mockRequest)
      .toPromise()
      .then(response => {
        expect(mockGetResponse).toEqual(response);
      });

    tick();

    expect(mockGetResponse).toBeDefined();
  }));
});
