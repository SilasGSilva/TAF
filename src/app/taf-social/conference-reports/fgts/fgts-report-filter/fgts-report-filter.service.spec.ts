import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { of } from 'rxjs';
import { FgtsReportFilterService } from './fgts-report-filter.service';

xdescribe('FgtsReportFilterService', () => {
  let service: FgtsReportFilterService;
  const menuContext = 'esocial';

  class MockHttpService {
    get(url: string): any {
      let dummyResponse;

      if ( url === '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/Status' || url === '/api/rh/esocial/v1/reportEsocialBaseConfer/Status') {
        dummyResponse = {
          finished: false,
          percent: 31,
        };
      } else {
        dummyResponse = {
          length: 1,
          items: [
            {
              cpfNumber: '09686006893',
              basis: [
                {
                  fgtsBasis: 7662.15,
                  branchId: '34484188000536',
                  lotationCode: '06442',
                  fgts13Basis: 0,
                  fgtsRescissionBasis: 0,
                  fgtsTafBasis: 7662.15,
                  fgts13TafBasis: 0,
                  fgtsRescissionTafBasis: 0,
                  fgtsRescissionRetBasis: 0,
                  fgtsRetBasis: 0,
                  fgts13RetBasis: 0,
                },
                {
                  fgtsBasis: 7301.99,
                  branchId: '34484188000536',
                  lotationCode: '06501',
                  fgts13Basis: 0,
                  fgtsRescissionBasis: 293.05,
                  fgtsTafBasis: 7301.99,
                  fgts13TafBasis: 0,
                  fgtsRescissionTafBasis: 293.05,
                  fgtsRescissionRetBasis: 0,
                  fgtsRetBasis: 0,
                  fgts13RetBasis: 0,
                },
              ],
              fgts13Value: 0,
              fgtsRescissionTafValue: 0,
              fgtsRescissionRetValue: 0,
              esocialCategory: '101',
              fgtsRescissionValue: 0,
              fgtsTafValue: 0,
              fgts13TafValue: 0,
              fgtsRetValue: 540.88,
              fgts13RetValue: 0,
              name: 'TARLEI PEREIRA FRANCA',
              esocialRegistration: '011400004820180712144044',
              fgtsValue: 0,
            },
            {
              cpfNumber: '22271472881',
              basis: [
                {
                  fgtsBasis: 9169.71,
                  branchId: '34484188000536',
                  lotationCode: '06441',
                  fgts13Basis: 0,
                  fgtsRescissionBasis: 0,
                  fgtsTafBasis: 9169.71,
                  fgts13TafBasis: 0,
                  fgtsRescissionTafBasis: 0,
                  fgtsRescissionRetBasis: 0,
                  fgtsRetBasis: 8490.47,
                  fgts13RetBasis: 0,
                },
              ],
              fgts13Value: 0,
              fgtsRescissionTafValue: 0,
              fgtsRescissionRetValue: 0,
              esocialCategory: '101',
              fgtsRescissionValue: 0,
              fgtsTafValue: 0,
              fgts13TafValue: 0,
              fgtsRetValue: 679.23,
              fgts13RetValue: 0,
              name: 'LUCIANO SANTOS',
              esocialRegistration: '011400009620190802102812',
              fgtsValue: 0,
            },
          ],
          hasNext: true,
        };
      }

      return of(dummyResponse);
    }

    post(url: string): any {
      const dummyResponse = {
        requestId: '124bcd82-71dd-a91f-6cca-a5dfbfc23601',
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FgtsReportFilterService,
        { provide: HttpService, useClass: MockHttpService }
      ],
    });

    service = TestBed.inject(FgtsReportFilterService);
  });

  it('deve criar o serviço de filtro do relatório de FGTS', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o POST da API e retornar os dados corretamente', async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      registrationNumber: '',
      lotationCode: '',
      eSocialCategory: [''],
      cpfNumber: [''],
      eSocialRegistration: [''],
      paymentPeriod: '201910',
      tribute: '1',
    };

    const mockPostResponse = {
      requestId: '124bcd82-71dd-a91f-6cca-a5dfbfc23601',
    };

    const specResponse = await service.postExecuteReport(mockRequest, menuContext).toPromise();
    expect(mockPostResponse).toEqual(specResponse);

  });

  it('deve realizar o GET através da função getStatusReport e retornar os dados corretamente', async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
    };

    const mockGetResponse = {
      finished: false,
      percent: 31,
    };

    const specResponse = await service.getStatusReport(mockRequest, menuContext).toPromise();
    expect(specResponse).toEqual(mockGetResponse);

  });

  it('deve realizar a chamada do metodo getCompany e retornar o resultado correto', () => {
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

    expect(service.getCompany()).toEqual('T1|D MG 01');

    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  it('deve realizar a chamada do metodo getCompany com productline Protheus e sem a propriedade branch_code e retornar o resultado correto', () => {
    const TAFCompany = { company_code: 'T1' };
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

    expect(service.getCompany()).toEqual('T1');

    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  it('deve realizar a chamada do metodo getCompany com productline Datasul e retornar o resultado correto', () => {
    const TAFCompany = { company_code: 'T1' };
    const company = JSON.stringify(TAFCompany);

    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Datasul'
    };

    const config = JSON.stringify(ERPAPPCONFIG);

    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    expect(service.getCompany()).toEqual('');

    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  it('deve realizar o GET através da função getReportTable e retornar os dados corretamente', async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      length: 1,
      items: [
        {
          cpfNumber: '09686006893',
          basis: [
            {
              fgtsBasis: 7662.15,
              branchId: '34484188000536',
              lotationCode: '06442',
              fgts13Basis: 0,
              fgtsRescissionBasis: 0,
              fgtsTafBasis: 7662.15,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 0,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
            {
              fgtsBasis: 7301.99,
              branchId: '34484188000536',
              lotationCode: '06501',
              fgts13Basis: 0,
              fgtsRescissionBasis: 293.05,
              fgtsTafBasis: 7301.99,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 293.05,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
          ],
          fgts13Value: 0,
          fgtsRescissionTafValue: 0,
          fgtsRescissionRetValue: 0,
          esocialCategory: '101',
          fgtsRescissionValue: 0,
          fgtsTafValue: 0,
          fgts13TafValue: 0,
          fgtsRetValue: 540.88,
          fgts13RetValue: 0,
          name: 'TARLEI PEREIRA FRANCA',
          esocialRegistration: '011400004820180712144044',
          fgtsValue: 0,
        },
        {
          cpfNumber: '22271472881',
          basis: [
            {
              fgtsBasis: 9169.71,
              branchId: '34484188000536',
              lotationCode: '06441',
              fgts13Basis: 0,
              fgtsRescissionBasis: 0,
              fgtsTafBasis: 9169.71,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 0,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 8490.47,
              fgts13RetBasis: 0,
            },
          ],
          fgts13Value: 0,
          fgtsRescissionTafValue: 0,
          fgtsRescissionRetValue: 0,
          esocialCategory: '101',
          fgtsRescissionValue: 0,
          fgtsTafValue: 0,
          fgts13TafValue: 0,
          fgtsRetValue: 679.23,
          fgts13RetValue: 0,
          name: 'LUCIANO SANTOS',
          esocialRegistration: '011400009620190802102812',
          fgtsValue: 0,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service.getReportTable(mockRequest, menuContext).toPromise();
    expect(specResponse).toEqual(mockGetResponse);

  });

  it('deve realizar o GET através da função getReportCard e retornar os dados corretamente', async () => {
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      length: 1,
      items: [
        {
          cpfNumber: '09686006893',
          basis: [
            {
              fgtsBasis: 7662.15,
              branchId: '34484188000536',
              lotationCode: '06442',
              fgts13Basis: 0,
              fgtsRescissionBasis: 0,
              fgtsTafBasis: 7662.15,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 0,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
            {
              fgtsBasis: 7301.99,
              branchId: '34484188000536',
              lotationCode: '06501',
              fgts13Basis: 0,
              fgtsRescissionBasis: 293.05,
              fgtsTafBasis: 7301.99,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 293.05,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 0,
              fgts13RetBasis: 0,
            },
          ],
          fgts13Value: 0,
          fgtsRescissionTafValue: 0,
          fgtsRescissionRetValue: 0,
          esocialCategory: '101',
          fgtsRescissionValue: 0,
          fgtsTafValue: 0,
          fgts13TafValue: 0,
          fgtsRetValue: 540.88,
          fgts13RetValue: 0,
          name: 'TARLEI PEREIRA FRANCA',
          esocialRegistration: '011400004820180712144044',
          fgtsValue: 0,
        },
        {
          cpfNumber: '22271472881',
          basis: [
            {
              fgtsBasis: 9169.71,
              branchId: '34484188000536',
              lotationCode: '06441',
              fgts13Basis: 0,
              fgtsRescissionBasis: 0,
              fgtsTafBasis: 9169.71,
              fgts13TafBasis: 0,
              fgtsRescissionTafBasis: 0,
              fgtsRescissionRetBasis: 0,
              fgtsRetBasis: 8490.47,
              fgts13RetBasis: 0,
            },
          ],
          fgts13Value: 0,
          fgtsRescissionTafValue: 0,
          fgtsRescissionRetValue: 0,
          esocialCategory: '101',
          fgtsRescissionValue: 0,
          fgtsTafValue: 0,
          fgts13TafValue: 0,
          fgtsRetValue: 679.23,
          fgts13RetValue: 0,
          name: 'LUCIANO SANTOS',
          esocialRegistration: '011400009620190802102812',
          fgtsValue: 0,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service.getReportCard(mockRequest, menuContext).toPromise();
    expect(specResponse).toEqual(mockGetResponse);

  });
});
