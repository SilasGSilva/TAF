import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrencyPipe } from '@angular/common';
import { PoDialogService, PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { of } from 'rxjs';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { PipeModule } from 'shared/pipe/pipe.module';
import { ESocialBaseConferIrrfRetValuesResponse } from '../irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { Employees } from '../irrf-models/Employees';
import { IrrfReportFilterService } from '../irrf-report-filter/services/irrf-report-filter.service';
import { IrrfReportParamsStoreService } from '../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportRequestParamsStoreService } from '../../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';
import { IrrfReportTableComponent } from './irrf-report-table.component';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
  },
};

describe(IrrfReportTableComponent.name, () => {
  let component: IrrfReportTableComponent;
  let fixture: ComponentFixture<IrrfReportTableComponent>;
  let httpController: HttpTestingController;
  let irrfReportFilterService: IrrfReportFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PipeModule,
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig)
      ],
      declarations: [IrrfReportTableComponent],
      providers: [
        CurrencyPipe,
        IrrfReportFilterService,
        IrrfReportParamsStoreService,
        IrrfReportRequestParamsStoreService,
        PoI18nPipe,
        PoDialogService
      ]
    })
    .compileComponents();

    sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify({ productLine: 'rm' }));
    sessionStorage.setItem('TAFCompany', JSON.stringify({ company_code: 'T1', branch_code: 'D MG 01' }));

    httpController = TestBed.inject(HttpTestingController);
    irrfReportFilterService = TestBed.inject(IrrfReportFilterService);

    fixture = TestBed.createComponent(IrrfReportTableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => httpController.verify());

  it(`deve criar o componente ${IrrfReportTableComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`deve instanciar o componente ${IrrfReportTableComponent.name} e inicializar suas variáveis de controle `, () => {
    component.itemsTable = [];
    fixture.detectChanges();
  });

  it(`#${IrrfReportTableComponent.prototype.expandEmployeeDemonstratives.name}
    deve requisitar valores de Demonstrativo e anexá-los ao funcionário certo corretamente quando solicitado o expandir subnível do funcionário`, () => {

    const mockSelectedEmployee: Employees = {
      cpfNumber: '336.154.780-61',
      name: 'GOKU',
      period: '202307',
      totalIrrfRetention: {
        tafValue: 200,
        erpValue: 100,
        retValue: 50
      },
      demonstrative: [
        {
          demonstrativeId: '',
          category: '',
          referencePeriod: '',
          origin: '',
          payday: '',
          irrfRetention: {
            tafValue: 0,
            erpValue: 0,
            retValue: 0
          }
        }
      ],
      divergent: true,
      warning: false
    };
    const mockResponseGetIrrfRetValues: ESocialBaseConferIrrfRetValuesResponse = {
      items: [
        {
          employees: [
            {
              cpfNumber: '336.154.780-61',
              name: 'GOKU',
              period: '202307',
              totalIrrfRetention: {
                tafValue: 200,
                erpValue: 100,
                retValue: 50
              },
              divergent: true,
              warning: false,
              demonstrative: [
                {
                  demonstrativeId: 'ENVELOPE 2',
                  category: '101',
                  referencePeriod: '2023/08',
                  origin: 'S-1200',
                  payday: '2023-08-01',
                  irrfRetention: {
                    tafValue: 200,
                    erpValue: 100,
                    retValue: 50
                  }
                }
              ]
            }
          ]
        }
      ],
      hasNext: false
    };
    const mockItemsTable: Array<Employees> = [
      {
        cpfNumber: '074.240.370-05',
        name: 'VEGETTA',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 100,
          erpValue: 100,
          retValue: 100
        },
        demonstrative: [
          {
            demonstrativeId: '',
            category: '',
            referencePeriod: '',
            origin: '',
            payday: '',
            irrfRetention: {
              tafValue: 0,
              erpValue: 0,
              retValue: 0
            }
          }
        ],
        divergent: false,
        warning: false,
      },
      {
        cpfNumber: '336.154.780-61',
        name: 'GOKU',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 200,
          erpValue: 100,
          retValue: 50
        },
        demonstrative: [
          {
            demonstrativeId: 'ENVELOPE 2',
            category: '101',
            referencePeriod: '2023/08',
            origin: 'S-1200',
            payday: '2023-08-01',
            irrfRetention: {
              tafValue: 200,
              erpValue: 100,
              retValue: 50
            }
          }
        ],
        divergent: true,
        warning: false,
      },
      {
        cpfNumber: '482.744.520-62',
        name: 'KURININ',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 300,
          erpValue: 200,
          retValue: 100
        },
        demonstrative: [
          {
            demonstrativeId: '',
            category: '',
            referencePeriod: '',
            origin: '',
            payday: '',
            irrfRetention: {
              tafValue: 0,
              erpValue: 0,
              retValue: 0
            }
          }
        ],
        divergent: true,
        warning: false,
      }
    ];
    component.itemsTable = [
      {
        cpfNumber: '074.240.370-05',
        name: 'VEGETTA',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 100,
          erpValue: 100,
          retValue: 100
        },
        demonstrative: [
          {
            demonstrativeId: '',
            category: '',
            referencePeriod: '',
            origin: '',
            payday: '',
            irrfRetention: {
              tafValue: 0,
              erpValue: 0,
              retValue: 0
            }
          }
        ],
        divergent: false,
        warning: false,
      },
      {
        cpfNumber: '336.154.780-61',
        name: 'GOKU',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 200,
          erpValue: 100,
          retValue: 50
        },
        demonstrative: [
          {
            demonstrativeId: '',
            category: '',
            referencePeriod: '',
            origin: '',
            payday: '',
            irrfRetention: {
              tafValue: 0,
              erpValue: 0,
              retValue: 0
            }
          }
        ],
        divergent: true,
        warning: false
      },
      {
        cpfNumber: '482.744.520-62',
        name: 'KURININ',
        period: '202307',
        totalIrrfRetention: {
          tafValue: 300,
          erpValue: 200,
          retValue: 100
        },
        demonstrative: [
          {
            demonstrativeId: '',
            category: '',
            referencePeriod: '',
            origin: '',
            payday: '',
            irrfRetention: {
              tafValue: 0,
              erpValue: 0,
              retValue: 0
            }
          }
        ],
        divergent: true,
        warning: false
      }
    ];
    fixture.detectChanges();
    spyOn(irrfReportFilterService, 'getIrrfRetValues').and.returnValue(of(mockResponseGetIrrfRetValues));

    component.expandEmployeeDemonstratives(mockSelectedEmployee);

    fixture.detectChanges();
    expect(component.itemsTable[0])
      .toEqual(mockItemsTable[0]);

  });

});
