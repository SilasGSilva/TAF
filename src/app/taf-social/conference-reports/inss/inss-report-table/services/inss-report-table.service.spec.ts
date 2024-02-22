import { TestBed } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { of } from 'rxjs';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { InssReportTableService } from './inss-report-table.service';

describe(InssReportTableService.name, () => {
  let service: InssReportTableService;

  class MockHttpService {
    get(url: string): any {
      let dummyResponse;

      if (url === '/api/rh/esocial/v1/reportEsocialBaseConfer/InssValues') {
          dummyResponse = {
            items: [
              {
                cpfNumber: "883.385.175-34",
                name: "S2200 - BRUNO MARS",
                lotationCode: "DMG001TAF",
                esocialCategory: '101',
                esocialRegistration: '011400004820180712144044',
                branchId: '34484188000536',
                inssValue: 0,
                inssTafValue: 0,
                inssRetValue: 0,
                inssRetGrossValue: 0,
                inss13Value: 0,
                inss13TafValue: 0,
                inss13RetValue: 0,
                inss13RetGrossValue: 0,
                inssBasis: 0,
                inssTafBasis: 0,
                inssRetBasis: 0,
                inssRetSuspJudBasis: 0,
                inssRetTotalBasis: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                inss13Basis: 0,
                inss13TafBasis: 0,
                inss13RetBasis: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                inconsistent: false,
              },
              {
                cpfNumber: "470.808.238-03",
                name: "S2300 - SILAS GOMES",
                lotationCode: "DMG002TAF",
                esocialCategory: '101',
                esocialRegistration: '011400004820180712145055',
                branchId: '34484188000537',
                inssValue: 0,
                inssTafValue: 0,
                inssRetValue: 0,
                inssRetGrossValue: 0,
                inss13Value: 0,
                inss13TafValue: 0,
                inss13RetValue: 0,
                inss13RetGrossValue: 0,
                inssBasis: 0,
                inssTafBasis: 0,
                inssRetBasis: 0,
                inssRetSuspJudBasis: 0,
                inssRetTotalBasis: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                inss13Basis: 0,
                inss13TafBasis: 0,
                inss13RetBasis: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                inconsistent: false,
              },
            ],
            hasNext: true,
          };
      } else if (url === '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssValues') {
          dummyResponse = {
            items: [
              {
                cpfNumber: '639.088.150-96',
                name: "GPE - GPE GPE",
                lotationCode: "DMG003GPE",
                esocialCategory: '101',
                esocialRegistration: '011400004820180712145055',
                branchId: '34484188000538',
                inssValue: 0,
                inssTafValue: 0,
                inssRetValue: 0,
                inssRetGrossValue: 0,
                inss13Value: 0,
                inss13TafValue: 0,
                inss13RetValue: 0,
                inss13RetGrossValue: 0,
                inssBasis: 0,
                inssTafBasis: 0,
                inssRetBasis: 0,
                inssRetSuspJudBasis: 0,
                inssRetTotalBasis: 0,
                familySalaryValue: 0,
                familySalaryTafValue: 0,
                familySalaryRetValue: 0,
                maternitySalaryValue: 0,
                maternitySalaryTafValue: 0,
                maternitySalaryRetValue: 0,
                inss13Basis: 0,
                inss13TafBasis: 0,
                inss13RetBasis: 0,
                maternitySalary13Value: 0,
                maternitySalary13TafRetValue: 0,
                maternitySalary13RetValue: 0,
                inconsistent: false,
              },
            ],
            hasNext: true,
          };
      } else {
          dummyResponse = {
            finished: false,
            percent: 31,
          };
      }

      return of(dummyResponse);
    }

    post(url: string): any {
      const dummyResponse = {
        requestId: 'e23932f7-4db2-b060-4e0a-0abbf89cf500',
      };

      return of(dummyResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InssReportTableService,
        { provide: HttpService, useClass: MockHttpService },
        LiteralService
      ],
      imports: [
        CoreModule
      ]
    });

    service = TestBed.get(InssReportTableService);
  });

  it(`deve criar o serviço ${InssReportTableService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getReportModal e retornar os dados corretamente - esocial', async() => {
    let menuContext = 'eSocial';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4c',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      items: [
        {
          cpfNumber: "883.385.175-34",
          name: "S2200 - BRUNO MARS",
          lotationCode: "DMG001TAF",
          esocialCategory: '101',
          esocialRegistration: '011400004820180712144044',
          branchId: '34484188000536',
          inssValue: 0,
          inssTafValue: 0,
          inssRetValue: 0,
          inssRetGrossValue: 0,
          inss13Value: 0,
          inss13TafValue: 0,
          inss13RetValue: 0,
          inss13RetGrossValue: 0,
          inssBasis: 0,
          inssTafBasis: 0,
          inssRetBasis: 0,
          inssRetSuspJudBasis: 0,
          inssRetTotalBasis: 0,
          familySalaryValue: 0,
          familySalaryTafValue: 0,
          familySalaryRetValue: 0,
          maternitySalaryValue: 0,
          maternitySalaryTafValue: 0,
          maternitySalaryRetValue: 0,
          inss13Basis: 0,
          inss13TafBasis: 0,
          inss13RetBasis: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
          maternitySalary13RetValue: 0,
          inconsistent: false,
        },
        {
          cpfNumber: "470.808.238-03",
          name: "S2300 - SILAS GOMES",
          lotationCode: "DMG002TAF",
          esocialCategory: '101',
          esocialRegistration: '011400004820180712145055',
          branchId: '34484188000537',
          inssValue: 0,
          inssTafValue: 0,
          inssRetValue: 0,
          inssRetGrossValue: 0,
          inss13Value: 0,
          inss13TafValue: 0,
          inss13RetValue: 0,
          inss13RetGrossValue: 0,
          inssBasis: 0,
          inssTafBasis: 0,
          inssRetBasis: 0,
          inssRetSuspJudBasis: 0,
          inssRetTotalBasis: 0,
          familySalaryValue: 0,
          familySalaryTafValue: 0,
          familySalaryRetValue: 0,
          maternitySalaryValue: 0,
          maternitySalaryTafValue: 0,
          maternitySalaryRetValue: 0,
          inss13Basis: 0,
          inss13TafBasis: 0,
          inss13RetBasis: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
          maternitySalary13RetValue: 0,
          inconsistent: false,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service
      .getReportModal(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getReportModal e retornar os dados corretamente - GPE', async() => {
    let menuContext = 'gpe';
    const mockRequest = {
      companyId: 'T1|D MG 01 ',
      requestId: 'dafa29ea-daae-91b3-4de8-a50cc4451c4d',
      synthetic: false,
      differencesOnly: false,
    };

    const mockGetResponse = {
      items: [
        {
          cpfNumber: '639.088.150-96',
          name: "GPE - GPE GPE",
          lotationCode: "DMG003GPE",
          esocialCategory: '101',
          esocialRegistration: '011400004820180712145055',
          branchId: '34484188000538',
          inssValue: 0,
          inssTafValue: 0,
          inssRetValue: 0,
          inssRetGrossValue: 0,
          inss13Value: 0,
          inss13TafValue: 0,
          inss13RetValue: 0,
          inss13RetGrossValue: 0,
          inssBasis: 0,
          inssTafBasis: 0,
          inssRetBasis: 0,
          inssRetSuspJudBasis: 0,
          inssRetTotalBasis: 0,
          familySalaryValue: 0,
          familySalaryTafValue: 0,
          familySalaryRetValue: 0,
          maternitySalaryValue: 0,
          maternitySalaryTafValue: 0,
          maternitySalaryRetValue: 0,
          inss13Basis: 0,
          inss13TafBasis: 0,
          inss13RetBasis: 0,
          maternitySalary13Value: 0,
          maternitySalary13TafRetValue: 0,
          maternitySalary13RetValue: 0,
          inconsistent: false,
        },
      ],
      hasNext: true,
    };

    const specResponse = await service
      .getReportModal(mockRequest, menuContext)
      .toPromise();
    expect(specResponse).toEqual(mockGetResponse);
  });
});
