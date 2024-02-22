import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { InssReportRequestParamsStoreService } from './../../../services/stores/inss/inss-report-request-params-store/inss-report-request-params-store.service';
import { InssReportParamsStoreService } from './../../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportFilterService } from './inss-report-filter.service';

describe(InssReportFilterService.name, () => {
  let service: InssReportFilterService;

  class MockHttpService {
    get(url: string): any {
      let dummyResponse;

      if (url === '/api/rh/esocial/v1/reportEsocialBaseConfer/InssValues') {
        dummyResponse = {
          length: 1,
          items: [
            {
              cpfNumber: '09686006893',
              basis: [
                {
                  inssBasis: 7662.15,
                  branchId: '34484188000536',
                  lotationCode: '06442',
                  inss13Basis: 0,
                  inssRescissionBasis: 0,
                  inssTafBasis: 7662.15,
                  inss13TafBasis: 0,
                  inssRescissionTafBasis: 0,
                  inssRescissionRetBasis: 0,
                  inssRetBasis: 0,
                  inss13RetBasis: 0,
                },
                {
                  inssBasis: 7301.99,
                  branchId: '34484188000536',
                  lotationCode: '06501',
                  inss13Basis: 0,
                  inssRescissionBasis: 293.05,
                  inssTafBasis: 7301.99,
                  inss13TafBasis: 0,
                  inssRescissionTafBasis: 293.05,
                  inssRescissionRetBasis: 0,
                  inssRetBasis: 0,
                  inss13RetBasis: 0,
                },
              ],
              inss13Value: 0,
              inssRescissionTafValue: 0,
              inssRescissionRetValue: 0,
              esocialCategory: '101',
              inssRescissionValue: 0,
              inssTafValue: 0,
              inss13TafValue: 0,
              inssRetValue: 540.88,
              inss13RetValue: 0,
              name: 'TARLEI PEREIRA FRANCA',
              esocialRegistration: '011400004820180712144044',
              inssValue: 0,
            },
            {
              cpfNumber: '22271472881',
              basis: [
                {
                  inssBasis: 9169.71,
                  branchId: '34484188000536',
                  lotationCode: '06441',
                  inss13Basis: 0,
                  inssRescissionBasis: 0,
                  inssTafBasis: 9169.71,
                  inss13TafBasis: 0,
                  inssRescissionTafBasis: 0,
                  inssRescissionRetBasis: 0,
                  inssRetBasis: 8490.47,
                  inss13RetBasis: 0,
                },
              ],
              inss13Value: 0,
              inssRescissionTafValue: 0,
              inssRescissionRetValue: 0,
              esocialCategory: '101',
              inssRescissionValue: 0,
              inssTafValue: 0,
              inss13TafValue: 0,
              inssRetValue: 679.23,
              inss13RetValue: 0,
              name: 'LUCIANO SANTOS',
              esocialRegistration: '011400009620190802102812',
              inssValue: 0,
            },
          ],
          hasNext: true,
        };
      } else if (url === '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssValues') {
          dummyResponse = {
            length: 1,
            items: [
              {
                cpfNumber: '09686006893',
                basis: [
                  {
                    inssBasis: 7662.15,
                    branchId: '34484188000536',
                    lotationCode: '06442',
                    inss13Basis: 0,
                    inssRescissionBasis: 0,
                    inssTafBasis: 7662.15,
                    inss13TafBasis: 0,
                    inssRescissionTafBasis: 0,
                    inssRescissionRetBasis: 0,
                    inssRetBasis: 0,
                    inss13RetBasis: 0,
                  },
                  {
                    inssBasis: 7301.99,
                    branchId: '34484188000536',
                    lotationCode: '06501',
                    inss13Basis: 0,
                    inssRescissionBasis: 293.05,
                    inssTafBasis: 7301.99,
                    inss13TafBasis: 0,
                    inssRescissionTafBasis: 293.05,
                    inssRescissionRetBasis: 0,
                    inssRetBasis: 0,
                    inss13RetBasis: 0,
                  },
                ],
                inss13Value: 0,
                inssRescissionTafValue: 0,
                inssRescissionRetValue: 0,
                esocialCategory: '101',
                inssRescissionValue: 0,
                inssTafValue: 0,
                inss13TafValue: 0,
                inssRetValue: 540.88,
                inss13RetValue: 0,
                name: 'TARLEI PEREIRA FRANCA',
                esocialRegistration: '011400004820180712144044',
                inssValue: 0,
              },
              {
                cpfNumber: '22271472881',
                basis: [
                  {
                    inssBasis: 9169.71,
                    branchId: '34484188000536',
                    lotationCode: '06441',
                    inss13Basis: 0,
                    inssRescissionBasis: 0,
                    inssTafBasis: 9169.71,
                    inss13TafBasis: 0,
                    inssRescissionTafBasis: 0,
                    inssRescissionRetBasis: 0,
                    inssRetBasis: 8490.47,
                    inss13RetBasis: 0,
                  },
                ],
                inss13Value: 0,
                inssRescissionTafValue: 0,
                inssRescissionRetValue: 0,
                esocialCategory: '101',
                inssRescissionValue: 0,
                inssTafValue: 0,
                inss13TafValue: 0,
                inssRetValue: 679.23,
                inss13RetValue: 0,
                name: 'LUCIANO SANTOS',
                esocialRegistration: '011400009620190802102812',
                inssValue: 0,
              },
            ],
            hasNext: true,
          };

      } else if (url === '/api/rh/esocial/v1/reportEsocialBaseConfer/InssRetValues') {
          dummyResponse = {
            items: [
              {
                cpfNumber: '88338517534',
                name: 'S2200 - BRUNO MARS',
                inssGrossValue: 42.96,
                inssTafGrossValue: 50.39,
                inssRetGrossValue: 751.97,
                inssRetDescGrossValue: 50.39,
                inss13GrossValue: 0,
                inss13TafGrossValue: 0,
                inss13RetGrossValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                divergent: true,
              },
              {
                name: 'ERIC CARTMAN',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: true,
                inssTafGrossValue: 10.99,
                familySalaryRetValue: 0,
                inssRetGrossValue: 751.97,
                inssGrossValue: 10.99,
                maternitySalary13RetValue: 0,
                cpfNumber: '34662710707',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 10.99,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
              {
                name: 'KENNY MCCORMICK',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: true,
                inssTafGrossValue: 15.01,
                familySalaryRetValue: 0,
                inssRetGrossValue: 751.97,
                inssGrossValue: 15.01,
                maternitySalary13RetValue: 0,
                cpfNumber: '28061017008',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 15.01,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
              {
                name: 'MARIA CAROLINA GOMES',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: false,
                inssTafGrossValue: 0,
                familySalaryRetValue: 0,
                inssRetGrossValue: 0,
                inssGrossValue: 0,
                maternitySalary13RetValue: 0,
                cpfNumber: '74463118867',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 0,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
            ],
            hasNext: false,
          };

      } else if (url === '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssRetValues') {
          dummyResponse = {
            items: [
              {
                cpfNumber: '88338517534',
                name: 'S2200 - BRUNO MARS',
                inssGrossValue: 42.96,
                inssTafGrossValue: 50.39,
                inssRetGrossValue: 751.97,
                inssRetDescGrossValue: 50.39,
                inss13GrossValue: 0,
                inss13TafGrossValue: 0,
                inss13RetGrossValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                divergent: true,
              },
              {
                name: 'ERIC CARTMAN',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: true,
                inssTafGrossValue: 10.99,
                familySalaryRetValue: 0,
                inssRetGrossValue: 751.97,
                inssGrossValue: 10.99,
                maternitySalary13RetValue: 0,
                cpfNumber: '34662710707',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 10.99,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
              {
                name: 'KENNY MCCORMICK',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: true,
                inssTafGrossValue: 15.01,
                familySalaryRetValue: 0,
                inssRetGrossValue: 751.97,
                inssGrossValue: 15.01,
                maternitySalary13RetValue: 0,
                cpfNumber: '28061017008',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 15.01,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
              {
                name: 'MARIA CAROLINA GOMES',
                maternitySalaryTafValue: 0,
                maternitySalaryValue: 0,
                inss13GrossValue: 0,
                divergent: false,
                inssTafGrossValue: 0,
                familySalaryRetValue: 0,
                inssRetGrossValue: 0,
                inssGrossValue: 0,
                maternitySalary13RetValue: 0,
                cpfNumber: '74463118867',
                inss13TafGrossValue: 0,
                maternitySalaryRetValue: 0,
                inssRetDescGrossValue: 0,
                inss13RetGrossValue: 0,
                familySalaryTafValue: 0,
                inss13DescGrossValue: 0,
                familySalaryValue: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
              },
            ],
            hasNext: false,
          };

      } else {
          dummyResponse = {
          finished: false,
          percent: 31,
        };
      };

      return of(dummyResponse);
    };

    post(url: string): any {
      const dummyResponse = {
        requestId: 'e23932f7-4db2-b060-4e0a-0abbf89cf671',
      };

      return of(dummyResponse);
    };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InssReportFilterService,
        InssReportParamsStoreService,
        InssReportRequestParamsStoreService,
        {
          provide: HttpService,
          useClass: MockHttpService
        },
      ],
    });

    service = TestBed.inject(InssReportFilterService);
  });

  it(`deve criar o serviço de ${InssReportFilterService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o POST da API e retornar os dados corretamente - gpe', async () => {
    let menuContext = 'gpe';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      cpfNumber: '',
      differencesOnly: false,
      eSocialCategory: [],
      eSocialRegistration: '',
      lotationCode: [],
      numberOfLines: 30,
      paymentPeriod: '201910',
      registrationNumber: [],
      tribute: '1',
    };

    const mockPostResponse = {
      requestId: 'e23932f7-4db2-b060-4e0a-0abbf89cf671',
    };

    const specResponse = await service
      .postExecuteReport(mockRequest, menuContext)
      .toPromise();
    expect(mockPostResponse).toEqual(specResponse);
  });

  it('deve realizar o POST da API e retornar os dados corretamente - esocial', async () => {
    let menuContext = 'esocial';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      cpfNumber: '',
      differencesOnly: false,
      eSocialCategory: [],
      eSocialRegistration: '',
      lotationCode: [],
      numberOfLines: 30,
      paymentPeriod: '201910',
      registrationNumber: [],
      tribute: '1',
    };

    const mockPostResponse = {
      requestId: 'e23932f7-4db2-b060-4e0a-0abbf89cf671',
    };

    const specResponse = await service
      .postExecuteReport(mockRequest, menuContext)
      .toPromise();
    expect(mockPostResponse).toEqual(specResponse);
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

  it('deve realizar o GET através da função getStatusReport e retornar os dados corretamente - esocial', async () => {
    let menuContext = 'esocial';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
    };

    const mockGetResponse = {
      finished: false,
      percent: 31,
    };

    const specResponse = await service
      .getStatusReport(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getStatusReport e retornar os dados corretamente - gpe', async () => {
    let menuContext = 'gpe';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
    };

    const mockGetResponse = {
      finished: false,
      percent: 31,
    };

    const specResponse = await service
      .getStatusReport(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getInssRetValues e retornar os dados corretamente - esocial', async () => {
    let menuContext = 'esocial';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      items: [
        {
          cpfNumber: '88338517534',
          name: 'S2200 - BRUNO MARS',
          inssGrossValue: 42.96,
          inssTafGrossValue: 50.39,
          inssRetGrossValue: 751.97,
          inssRetDescGrossValue: 50.39,
          inss13GrossValue: 0,
          inss13TafGrossValue: 0,
          inss13RetGrossValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          familySalaryTafValue: 0,
          familySalaryRetValue: 0,
          maternitySalaryValue: 0,
          maternitySalaryTafValue: 0,
          maternitySalaryRetValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
          maternitySalary13RetValue: 0,
          divergent: true,
        },
        {
          name: 'ERIC CARTMAN',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: true,
          inssTafGrossValue: 10.99,
          familySalaryRetValue: 0,
          inssRetGrossValue: 751.97,
          inssGrossValue: 10.99,
          maternitySalary13RetValue: 0,
          cpfNumber: '34662710707',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 10.99,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
        {
          name: 'KENNY MCCORMICK',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: true,
          inssTafGrossValue: 15.01,
          familySalaryRetValue: 0,
          inssRetGrossValue: 751.97,
          inssGrossValue: 15.01,
          maternitySalary13RetValue: 0,
          cpfNumber: '28061017008',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 15.01,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
        {
          name: 'MARIA CAROLINA GOMES',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: false,
          inssTafGrossValue: 0,
          familySalaryRetValue: 0,
          inssRetGrossValue: 0,
          inssGrossValue: 0,
          maternitySalary13RetValue: 0,
          cpfNumber: '74463118867',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 0,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
      ],
      hasNext: false,
    };

    const specResponse = await service
      .getInssRetValues(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getInssRetValues e retornar os dados corretamente - gpe', async () => {
    let menuContext = 'gpe';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4b',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      items: [
        {
          cpfNumber: '88338517534',
          name: 'S2200 - BRUNO MARS',
          inssGrossValue: 42.96,
          inssTafGrossValue: 50.39,
          inssRetGrossValue: 751.97,
          inssRetDescGrossValue: 50.39,
          inss13GrossValue: 0,
          inss13TafGrossValue: 0,
          inss13RetGrossValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          familySalaryTafValue: 0,
          familySalaryRetValue: 0,
          maternitySalaryValue: 0,
          maternitySalaryTafValue: 0,
          maternitySalaryRetValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
          maternitySalary13RetValue: 0,
          divergent: true,
        },
        {
          name: 'ERIC CARTMAN',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: true,
          inssTafGrossValue: 10.99,
          familySalaryRetValue: 0,
          inssRetGrossValue: 751.97,
          inssGrossValue: 10.99,
          maternitySalary13RetValue: 0,
          cpfNumber: '34662710707',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 10.99,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
        {
          name: 'KENNY MCCORMICK',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: true,
          inssTafGrossValue: 15.01,
          familySalaryRetValue: 0,
          inssRetGrossValue: 751.97,
          inssGrossValue: 15.01,
          maternitySalary13RetValue: 0,
          cpfNumber: '28061017008',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 15.01,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
        {
          name: 'MARIA CAROLINA GOMES',
          maternitySalaryTafValue: 0,
          maternitySalaryValue: 0,
          inss13GrossValue: 0,
          divergent: false,
          inssTafGrossValue: 0,
          familySalaryRetValue: 0,
          inssRetGrossValue: 0,
          inssGrossValue: 0,
          maternitySalary13RetValue: 0,
          cpfNumber: '74463118867',
          inss13TafGrossValue: 0,
          maternitySalaryRetValue: 0,
          inssRetDescGrossValue: 0,
          inss13RetGrossValue: 0,
          familySalaryTafValue: 0,
          inss13DescGrossValue: 0,
          familySalaryValue: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
        },
      ],
      hasNext: false,
    };

    const specResponse = await service
      .getInssRetValues(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getReportCard e retornar os dados corretamente - esocial', async () => {
    let menuContext = 'esocial';
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
              inssBasis: 7662.15,
              branchId: '34484188000536',
              lotationCode: '06442',
              inss13Basis: 0,
              inssRescissionBasis: 0,
              inssTafBasis: 7662.15,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 0,
              inssRescissionRetBasis: 0,
              inssRetBasis: 0,
              inss13RetBasis: 0,
            },
            {
              inssBasis: 7301.99,
              branchId: '34484188000536',
              lotationCode: '06501',
              inss13Basis: 0,
              inssRescissionBasis: 293.05,
              inssTafBasis: 7301.99,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 293.05,
              inssRescissionRetBasis: 0,
              inssRetBasis: 0,
              inss13RetBasis: 0,
            },
          ],
          inss13Value: 0,
          inssRescissionTafValue: 0,
          inssRescissionRetValue: 0,
          esocialCategory: '101',
          inssRescissionValue: 0,
          inssTafValue: 0,
          inss13TafValue: 0,
          inssRetValue: 540.88,
          inss13RetValue: 0,
          name: 'TARLEI PEREIRA FRANCA',
          esocialRegistration: '011400004820180712144044',
          inssValue: 0,
        },
        {
          cpfNumber: '22271472881',
          basis: [
            {
              inssBasis: 9169.71,
              branchId: '34484188000536',
              lotationCode: '06441',
              inss13Basis: 0,
              inssRescissionBasis: 0,
              inssTafBasis: 9169.71,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 0,
              inssRescissionRetBasis: 0,
              inssRetBasis: 8490.47,
              inss13RetBasis: 0,
            },
          ],
          inss13Value: 0,
          inssRescissionTafValue: 0,
          inssRescissionRetValue: 0,
          esocialCategory: '101',
          inssRescissionValue: 0,
          inssTafValue: 0,
          inss13TafValue: 0,
          inssRetValue: 679.23,
          inss13RetValue: 0,
          name: 'LUCIANO SANTOS',
          esocialRegistration: '011400009620190802102812',
          inssValue: 0,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service
      .getReportCard(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });


  it('deve realizar o GET através da função getReportCard e retornar os dados corretamente - gpe', async () => {
    let menuContext = 'gpe';
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
              inssBasis: 7662.15,
              branchId: '34484188000536',
              lotationCode: '06442',
              inss13Basis: 0,
              inssRescissionBasis: 0,
              inssTafBasis: 7662.15,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 0,
              inssRescissionRetBasis: 0,
              inssRetBasis: 0,
              inss13RetBasis: 0,
            },
            {
              inssBasis: 7301.99,
              branchId: '34484188000536',
              lotationCode: '06501',
              inss13Basis: 0,
              inssRescissionBasis: 293.05,
              inssTafBasis: 7301.99,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 293.05,
              inssRescissionRetBasis: 0,
              inssRetBasis: 0,
              inss13RetBasis: 0,
            },
          ],
          inss13Value: 0,
          inssRescissionTafValue: 0,
          inssRescissionRetValue: 0,
          esocialCategory: '101',
          inssRescissionValue: 0,
          inssTafValue: 0,
          inss13TafValue: 0,
          inssRetValue: 540.88,
          inss13RetValue: 0,
          name: 'TARLEI PEREIRA FRANCA',
          esocialRegistration: '011400004820180712144044',
          inssValue: 0,
        },
        {
          cpfNumber: '22271472881',
          basis: [
            {
              inssBasis: 9169.71,
              branchId: '34484188000536',
              lotationCode: '06441',
              inss13Basis: 0,
              inssRescissionBasis: 0,
              inssTafBasis: 9169.71,
              inss13TafBasis: 0,
              inssRescissionTafBasis: 0,
              inssRescissionRetBasis: 0,
              inssRetBasis: 8490.47,
              inss13RetBasis: 0,
            },
          ],
          inss13Value: 0,
          inssRescissionTafValue: 0,
          inssRescissionRetValue: 0,
          esocialCategory: '101',
          inssRescissionValue: 0,
          inssTafValue: 0,
          inss13TafValue: 0,
          inssRetValue: 679.23,
          inss13RetValue: 0,
          name: 'LUCIANO SANTOS',
          esocialRegistration: '011400009620190802102812',
          inssValue: 0,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service
      .getReportCard(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });
});
