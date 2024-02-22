import { CoreModule } from './../../../core/core.module';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { LiteralService } from 'core/i18n/literal.service';
import { DownloadService } from 'shared/download/download.service';

import { ExportExcelEsocialReportsService } from './export-excel-esocial-reports.service';
import { of } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { ESocialBaseConferFgtsValuesResponse } from '../conference-reports-models/ESocialBaseConferFgtsValuesResponse';

xdescribe('ExportExcelEsocialReportsService', () => {
  let httpTestingController: HttpTestingController;
  let service: ExportExcelEsocialReportsService;

  class MockHttpService {
    get(url: string): any {
      const dummyResponse = {
        items: [
          {
            cpfNumber: '',
            basis: [
              {
                fgtsBasis: 63054.5,
                branchId: '',
                lotationCode: '',
                fgts13Basis: 0,
                fgtsRescissionBasis: 19083.2,
                fgtsTafBasis: 61166.67,
                fgts13TafBasis: 0,
                fgtsRescissionTafBasis: 9783.34,
                fgtsRescissionRetBasis: 0,
                fgtsRetBasis: 0,
                fgts13RetBasis: 0,
              },
            ],
            fgtsRescissionTafValue: 782.66,
            fgtsRescissionRetValue: 0,
            esocialCategory: '',
            fgts13Value: 0,
            fgtsRescissionValue: 1734.25,
            fgts13TafValue: 0,
            fgtsRetValue: 0,
            fgts13RetValue: 0,
            fgtsTafValue: 4893.33,
            name: '',
            esocialRegistration: '',
            fgtsValue: 5044.35,
          },
        ],
        hasNext: false,
        requestId: '123',
        differencesOnly: false,
      };

      return of(dummyResponse);
    }

    getAsync(url: string): Promise<any> {
      return this.get(url).toPromise();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExportExcelEsocialReportsService,
        LiteralService,
        DownloadService,
        { provide: HttpService, useClass: MockHttpService },
      ],
      imports: [HttpClientTestingModule, CoreModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ExportExcelEsocialReportsService);

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
      productLine: 'Protheus'
    };

    const config = JSON.stringify(ERPAPPCONFIG);

    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('ERPAPPCONFIG', config);
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
    sessionStorage.removeItem('TAFFull');
    sessionStorage.removeItem('TAFContext');

    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar o método getReportFGTS para o contexto eSocial e retornar os dados corretamente', async () => {
    sessionStorage.setItem('TAFContext', 'esocial');

    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      differencesOnly: false,
      page: 1,
      pageSize: 1000,
      requestId: '55e04839-c3d4-f2fe-8f47-7b165e775943',
      synthetic: false,
    };

    const mockResponse: ESocialBaseConferFgtsValuesResponse = {
      items: [
        {
          cpfNumber: '',
          basis: [
            {
              fgtsBasis: 63054.5,
              branchId: '',
              lotationCode: '',
              fgts13Basis: 0,
              fgtsRescissionBasis: 19083.2,
              fgtsTafBasis: 61166.67,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 9783.34,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
          ],
          fgtsRescissionTafValue: 782.66,
          fgtsRescissionRetValue: 0,
          esocialCategory: '',
          fgts13Value: 0,
          fgtsRescissionValue: 1734.25,
          fgts13TafValue: 0,
          fgtsRetValue: 0,
          fgts13RetValue: 0,
          fgtsTafValue: 4893.33,
          name: '',
          esocialRegistration: '',
          fgtsValue: 5044.35,
          fgtsTotValue: 6778.6,
          fgtsTotTafValue: 5675.99,
          fgtsTotRetValue: 0,
        },
      ],
      hasNext: false,
      requestId: '123',
      differencesOnly: false,
    };

    const specResponse = await service.getReportFGTS(mockRequest);
    expect(specResponse).toEqual(mockResponse);

  });

  it('deve chamar o método getReportFGTS para o contexto GPE e retornar os dados corretamente', async () => {
    sessionStorage.setItem('TAFContext', 'gpe');

    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      differencesOnly: false,
      page: 1,
      pageSize: 1000,
      requestId: '55e04839-c3d4-f2fe-8f47-7b165e775943',
      synthetic: false,
    };

    const mockResponse = {
      items: [
        {
          cpfNumber: '',
          basis: [
            {
              fgtsBasis: 63054.5,
              branchId: '',
              lotationCode: '',
              fgts13Basis: 0,
              fgtsRescissionBasis: 19083.2,
              fgtsTafBasis: 61166.67,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 9783.34,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
          ],
          fgtsRescissionTafValue: 782.66,
          fgtsRescissionRetValue: 0,
          esocialCategory: '',
          fgts13Value: 0,
          fgtsRescissionValue: 1734.25,
          fgts13TafValue: 0,
          fgtsRetValue: 0,
          fgts13RetValue: 0,
          fgtsTafValue: 4893.33,
          name: '',
          esocialRegistration: '',
          fgtsValue: 5044.35,
          fgtsTotValue: 6778.6,
          fgtsTotTafValue: 5675.99,
          fgtsTotRetValue: 0,
        },
      ],
      hasNext: false,
      requestId: '123',
      differencesOnly: false,
    };

    const specResponse = await service.getReportFGTS(mockRequest);
    expect(specResponse).toEqual(mockResponse);

  });

  it('deve chamar o método PrintReport e retornar os dados corretamente', () => {
    sessionStorage.setItem('TAFFull', 'true');
    const mockTaxInfo = 'FGTS';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      differencesOnly: false,
      page: 1,
      pageSize: 1000,
      requestId: '55e04839-c3d4-f2fe-8f47-7b165e775943',
      synthetic: false,
    };

    const spyBasis = spyOn(service, 'headerBasis')
      .withArgs(mockTaxInfo, true)
      .and.returnValue([
        'CPF',
        'Nome',
        'Matrícula',
        'Categoria',
        'Folha - Base FGTS',
        'TAF - Base FGTS',
        'Governo - Base FGTS',
        'Folha - Base FGTS - 13º Salário',
        'TAF - Base FGTS - 13º Salário',
        'Governo - Base FGTS - 13º Salário',
        'Folha - Base FGTS - Rescisório',
        'TAF - Base FGTS - Rescisório',
        'Governo - Base FGTS - Rescisório',
      ]);

    service.PrintReport(mockTaxInfo, mockRequest);

    expect(spyBasis).toHaveBeenCalled();
  });

  it('deve chamar o método PrintReport e retornar os dados corretamente com a variável TAFFull igual a false', () => {
    sessionStorage.setItem('TAFFull', 'false');
    const mockTaxInfo = 'FGTS';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      differencesOnly: false,
      page: 1,
      pageSize: 1000,
      requestId: '55e04839-c3d4-f2fe-8f47-7b165e775943',
      synthetic: false,
    };

    const spyBasis = spyOn(service, 'headerBasis')
      .withArgs(mockTaxInfo, false)
      .and.returnValue([
        'CPF',
        'Nome',
        'Matrícula',
        'Categoria',
        'Folha - Base FGTS',
        'Governo - Base FGTS',
        'Folha - Base FGTS - 13º Salário',
        'Governo - Base FGTS - 13º Salário',
        'Folha - Base FGTS - Rescisório',
        'Governo - Base FGTS - Rescisório',
      ]);

    service.PrintReport(mockTaxInfo, mockRequest);

    expect(spyBasis).toHaveBeenCalled();
  });
});
