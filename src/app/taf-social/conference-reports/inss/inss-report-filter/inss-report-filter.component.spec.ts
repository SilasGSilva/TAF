import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { PoI18nConfig, PoI18nModule, PoMultiselectOption } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { LegacyStatusEnvironmentSocialService } from 'shared/legacy-status-environment/services/legacy-status-environment.service';
import { LegacyStatusEnvironmentSocial } from './../../../../models/legacy-status-environment-social';
import { ExecuteReportEsocialBaseConferResponse } from '../../conference-reports-models/ExecuteReportEsocialBaseConferResponse';
import { ReportEsocialBaseConferStatusResponse } from '../../conference-reports-models/ReportEsocialBaseConferStatusResponse';
import { InssReportFilterModule } from './inss-report-filter.module';
import { EstablishmentReportFilterService } from './inss-report-filter-establishment.service';
import { InssReportFilterLotationService } from './inss-report-filter-lotation.service';
import { InssReportFilterService } from './services/inss-report-filter.service';
import { InssReportFilterComponent } from './inss-report-filter.component';


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

const ERPAPPCONFIG = {
  name: 'Protheus THF',
  version: '12.23.0',
  serverBackend: '/',
  restEntryPoint: 'rest',
  versionAPI: '',
  appVersion: '0.1.6',
  productLine: 'Protheus',
};

const TAFCompany = {
  company_code: 'T1',
  branch_code: 'D MG 01',
};

xdescribe(InssReportFilterComponent.name, () => {
  let component: InssReportFilterComponent;
  let fixture: ComponentFixture<InssReportFilterComponent>;
  let EstablishmenteService: EstablishmentReportFilterService;
  let LotationService: InssReportFilterLotationService;
  let legacyStatusEnvironmentSocialService: LegacyStatusEnvironmentSocialService;
  let inssReportFilterService: InssReportFilterService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        InssReportFilterModule,
        PoI18nModule.config(i18nConfig),
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        MasksPipe
      ],
      declarations: [
        InssReportFilterComponent
      ]
    })
    .compileComponents();

    sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(ERPAPPCONFIG));
    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));

    fixture = TestBed.createComponent(InssReportFilterComponent);
    component = fixture.componentInstance;

    component.formFilter = new FormGroup({
      establishment: new FormControl('42987367000190'),
      period: new FormControl('2022-01'),
      differencesOnly: new FormControl(true),
    });
    component.formFilterModal = new FormGroup({
      modalEstablishment: new FormControl('53113791000122'),
      modalPeriod: new FormControl('2022-02'),
      modalDifferencesOnly: new FormControl(false),
      modalLotation: new FormControl([]),
      modalCategory: new FormControl([]),
      modalRegistration: new FormControl('0605'),
      modalPageSize: new FormControl(50),
      modalCpf: new FormControl('470.808.238-03'),
    });
    component.disableButton = false;

    EstablishmenteService = TestBed.inject(EstablishmentReportFilterService);
    LotationService = TestBed.inject(InssReportFilterLotationService);
    legacyStatusEnvironmentSocialService = TestBed.inject(LegacyStatusEnvironmentSocialService);
    inssReportFilterService = TestBed.inject(InssReportFilterService);
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it(`deve criar o componente ${InssReportFilterComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar uma matriz contendo dois valores booleanos para filtros de período - undefined ', () => {
    component.validPeriod = /^[0-9]{2}\/[0-9]{4}$/;

    component.formFilterModal.patchValue({
      modalPeriod: '05/2023',
    });

    const result = component.validFilters(undefined, 'period', true);

    expect(result.length).toBe(1);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(undefined);
  });

  it('deve retornar uma matriz contendo dois valores booleanos para filtros de período - passando CPF', () => {
    component.validPeriod = /^[0-9]{2}\/[0-9]{4}$/;

    component.formFilterModal.patchValue({
      modalPeriod: '05/2023',
    });

    const result = component.validFilters('47080823803', 'period', false);

    expect(result.length).toBe(2);
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(false);
  });

  it('deve retornar uma matriz contendo dois valores booleanos para filtros de período', () => {
    component.validPeriod = /^[0-9]{2}\/[0-9]{4}$/;

    component.formFilterModal.patchValue({
      modalPeriod: '05/2023',
    });

    const result = component.validFilters('47080823803', 'cpf', false);

    expect(result.length).toBe(2);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
  });

  it('deve desativar o botão quando os filtros são aplicados', () => {
    component.disableButton = true;
    component.applyFilters();

    expect(component.disableButton).toBeTruthy();
  });

  it('deve fechar o modal', () => {
    spyOn(component.poModal, 'close');
    component.closeModal();

    expect(component.poModal.close).toHaveBeenCalled();
  });

  it(`deve carregar os campos multiSelect na inicialização dos componentes`, done => {
    const mockResponseEstablishment = {
      items: [
        {
          companyId: "T1",
          registrationType: "1",
          registrationNumber: "30026038000102",
          description: ""
        },
        {
          companyId: "T1",
          registrationType: "1",
          registrationNumber: "53113791000122",
          description: ""
        },
        {
          companyId: "T1",
          registrationNumber: "59389246000140",
          registrationType: "1",
          description: ""
        },
      ],
      hasNext: false,
    };

    const mockResponseLotation = {
      items: [
        {
          companyId: "T1",
          branchId: "D MG 01",
          id: "000001",
          lotationCode: "DMG001TAF",
          description: ""
        },
        {
          companyId: "T1",
          branchId: "D MG 01",
          id: "000004",
          lotationCode: "DMG002TAF",
          description: ""
        },
        {
          companyId: "T1",
          branchId: "D MG 01",
          id: "000003",
          lotationCode: "DMG003TAF",
          description: ""
        },
        {
          companyId: "T1",
          branchId: "D MG 01",
          id: "000002",
          lotationCode: "DMG004TAF",
          description: ""
        }
      ],
      hasNext: false,
    };

    const mockListEstablishment: Array<PoMultiselectOption> = [
      {
        label: "30.026.038/0001-02",
        value: "30026038000102",
      },
      {
        label: "53.113.791/0001-22",
        value: "53113791000122",
      },
      {
        label: "59.389.246/0001-40",
        value: "59389246000140",
      },
    ];

    const mockListLotation: Array<PoMultiselectOption> = [
      {
        label: "DMG001TAF",
        value: "DMG001TAF",
      },
      {
        label: "DMG002TAF",
        value: "DMG002TAF",
      },
      {
        label: "DMG003TAF",
        value: "DMG003TAF",
      },
      {
        label: "DMG004TAF",
        value: "DMG004TAF",
      },
    ];

    const spyEstablishmentsService = spyOn(
      EstablishmenteService,
      'getListEstablishment'
    ).and.returnValue(of(mockResponseEstablishment));

    const spyLotationService = spyOn(
      LotationService,
      'getListLotations'
    ).and.returnValue(of(mockResponseLotation));

    component.ngOnInit();

    spyEstablishmentsService.calls
      .mostRecent()
      .returnValue.toPromise()
      .then(() => {
        fixture.detectChanges();

        expect(component.listEstablishment)
          .withContext(
            `Deve conter os itens do multiSelect de Estabelecimentos corretamente.`
          )
          .toEqual(mockListEstablishment);
        done();
      });

    spyLotationService.calls
      .mostRecent()
      .returnValue.toPromise()
      .then(() => {
        fixture.detectChanges();

        expect(component.listLotations)
          .withContext(
            `Deve conter os itens do multiSelect de Lotação corretamente.`
          )
          .toEqual(mockListLotation);
        done();
      });

    expect(true).toBeTrue();
  });

  it(`#applyFilter
    deve emitir eventos de reset, start de relatório e régua de processamento, resetar controles do relatório e gerar requestId corretamente quando solicitado`, fakeAsync(() => {
    const mockReportEsocialBaseConferResponse: ExecuteReportEsocialBaseConferResponse = {
      requestId: 'b83218c4-3dfa-0b0f-c6c0-ed534a7f9c10'
    };
    const mockReportEsocialBaseConferStatusResponse: ReportEsocialBaseConferStatusResponse = {
      percent: 100,
      finished: true
    };
    const mockLegacyStatusEnvironmentSocialService: LegacyStatusEnvironmentSocial = {
      isConfigured: true,
      isAvailable: true,
      inssIsUpToDate: false,
      fgtsIsUpToDate: true,
      irrfIsUpToDate: true,
      apiReturnError: null,
    };
    component.isTafFull = true;

    spyOn(legacyStatusEnvironmentSocialService, 'getLegacyStatusEnvironment').and.returnValue(
      of(mockLegacyStatusEnvironmentSocialService)
    );
    spyOn(inssReportFilterService, 'postExecuteReport').and.returnValue(
      of(mockReportEsocialBaseConferResponse)
    );
    spyOn(inssReportFilterService, 'getStatusReport').and.returnValue(
      of(mockReportEsocialBaseConferStatusResponse)
    );
    spyOn(component.reset, 'emit');
    spyOn(component.progressBar, 'emit');
    spyOn(component.sendingStarted, 'emit');

    component.applyFilters();

    expect(component.reset.emit)
      .withContext(
        'Deve emitir sinal que reseta controles de componentes externos ao relatório'
      )
      .toHaveBeenCalled();
    expect(component.progressBar.emit)
      .withContext(
        'Deve emitir percentual de conclusão para régua de progresso começando com valor 1'
      )
      .toHaveBeenCalledWith(1);

    mockLegacyStatusEnvironmentSocialService.inssIsUpToDate = true;
    component.applyFilters();

    discardPeriodicTasks();
    tick(1000);

    expect(component.progressBar.emit)
      .withContext(
        'Deve emitir percentual de conclusão para régua de progresso começando com valor 1'
      )
      .toHaveBeenCalledWith(1);
    expect(component.sendingStarted.emit)
      .withContext(
        'Deve emitir sinal positivo indicando início de geração do relatório'
      )
      .toHaveBeenCalledWith(true);
  }));

  it(`#onChangePeriodSelect
    deve atualizar o Filtro do Usuário conforme período inserido pelo usuário quando solicitado`, () => {
      const mockSelectedFilters = [
        { value: '2023/01', id: 'period', label: 'Período: 2023/01' }
      ];

    component.onChangePeriodSelect('2023/01', 'period', 'modalPeriod');

    expect(component.selectedFilters)
      .withContext('Deve conter o período inserido pelo usuário')
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeCpfSelect
    deve atualizar o Filtro do Usuário conforme CPF inserido pelo usuário quando solicitado`, () => {
      const mockSelectedFilters = [
        { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72' }
      ];

    component.onChangeCpfSelect('337.839.850-72');

    expect(component.selectedFilters)
      .withContext('Deve conter o CPF inserido pelo usuário')
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeMultiSelect
    deve atualizar o Filtro do Usuário conforme MultiSelect interagido pelo usuário quando solicitado`, () => {
      const mockSelectedFilters = [
        { value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22' }
      ];
      const mockMultiSelectEstablishment = [
        { label: '53.113.791/0001-22', value: '53113791000122' }
    ];

    component.onChangeMultiSelect('establishment', mockMultiSelectEstablishment, 'establishment', 'modalEstablishment');

    expect(component.selectedFilters)
      .withContext('Deve conter o Estabelecimento escolhido pelo usuário')
      .toEqual(mockSelectedFilters);

  });

  it(`#onChangeDisclaimerSelect
    deve atualizar o Filtro do Usuário conforme valores atualizados do Disclaimer inserido pelo usuário quando solicitado`, () => {
    const mockCategories = [ '', '101' ];
    const mockLotations = [ '', '061.9.10009' ];
    const mockEstablishment = [ '', '53113791000122' ];
    const mockSelectedFilters = [
      { value: '101', id: 'categories', label: 'Categoria: 101' },
      { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009' },
      { value: '202303', id: 'period', label: 'Período: 2023/03', hideClose: false },
      { value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22', hideClose: false },
      { value: 'Sim', id: 'differencesOnly', label: 'Somente divergências? : Sim', hideClose: false },
      { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001' },
      { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72' }
    ];

    component.onChangeDisclaimerSelect(mockSelectedFilters);

    expect(component.formFilterModal.get('modalCategory').value)
      .withContext('Deve atualizar campo MultiSelect de Categoria conforme novos valores do Disclaimer')
      .toEqual(mockCategories);
    expect(component.formFilterModal.get('modalLotation').value)
      .withContext('Deve atualizar campo MultiSelect de Lotações conforme novos valores do Disclaimer')
      .toEqual(mockLotations);
    expect(component.formFilterModal.get('modalEstablishment').value)
      .withContext('Deve atualizar campo MultiSelect de Estabelecimentos conforme novos valores do Disclaimer')
      .toEqual(mockEstablishment);
  });

  it(`#refreshFilters
    deve atualizar Filtro do Usuário eliminando campos ausentes quando a função de reset for gatilhada`, () => {
    const mockSelectedFilters = [
      {value: '101', id: 'categories', label: 'Categoria: 101'},
      {value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009'},
      {value: '091.9.10009', id: 'lotation', label: 'Lotação: 091.9.10009'},
      {value: 'BISCOITO', id: 'lotation', label: 'Lotação: BISCOITO'},
      {value: 'TRAKINAS', id: 'lotation', label: 'Lotação: TRAKINAS'},
      {value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22', hideClose: false},
      {value: '53113791000203', id: 'establishment', label: 'Estabelecimento: 53.113.791/0002-03', hideClose: false},
      {value: '67172676000648', id: 'establishment', label: 'Estabelecimento: 67.172.676/0006-48', hideClose: false},
      {value: '67172676000990', id: 'establishment', label: 'Estabelecimento: 67.172.676/0009-90', hideClose: false},
      {value: 'Sim', id: 'differencesOnly', label: 'Somente divergências? : Sim', hideClose: false},
    ];
    component.selectedFilters = [
      {value: '101', id: 'categories', label: 'Categoria: 101'},
      {value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009'},
      {value: '091.9.10009', id: 'lotation', label: 'Lotação: 091.9.10009'},
      {value: 'BISCOITO', id: 'lotation', label: 'Lotação: BISCOITO'},
      {value: 'TRAKINAS', id: 'lotation', label: 'Lotação: TRAKINAS'},
      {value: '202303', id: 'period', label: 'Período: 2023/03', hideClose: false},
      {value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22', hideClose: false},
      {value: '53113791000203', id: 'establishment', label: 'Estabelecimento: 53.113.791/0002-03', hideClose: false},
      {value: '67172676000648', id: 'establishment', label: 'Estabelecimento: 67.172.676/0006-48', hideClose: false},
      {value: '67172676000990', id: 'establishment', label: 'Estabelecimento: 67.172.676/0009-90', hideClose: false},
      {value: 'Sim', id: 'differencesOnly', label: 'Somente divergências? : Sim', hideClose: false},
      {value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001'},
      {value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72'}
    ];

    component.formFilterModal.get('modalPeriod').setValue('');
    component.formFilterModal.get('modalRegistration').setValue('');
    component.formFilterModal.get('modalCpf').setValue('');

    component.refreshFilters();

    expect(component.selectedFilters)
      .withContext('Deve conter os Filtros do Usuário atualizado após reset de campos ausentes')
      .toEqual(mockSelectedFilters);
});

it(`#onRemoveEvents
  Deve atualizar Filtro do Usuário conforme remoção via Disclaimer`, () => {
    const mockSelectedFilters = [
      { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72', hideClose: false },
      { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
      { value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22', hideClose: false },
      { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false },
      { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false },
      { value: true, id: 'differencesOnly', label: 'Somente divergências?: Sim', hideClose: false }
    ];
    const mockEstablishmentRemoved = {
      currentDisclaimers: [
        { value: '202301', id: 'period', label: 'Período: 2023/01', hideClose: false },
        { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72', hideClose: false },
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
        { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false },
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false },
        { value: true, id: 'differencesOnly', label: 'Somente divergências?: Sim', hideClose: false }
      ],
      removedDisclaimer:
        { value: '53113791000122', id: 'establishment', label: 'Estabelecimento: 53.113.791/0001-22', hideClose: false }
    };
    const mockPeriodRemoved = {
      currentDisclaimers: [
        { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72', hideClose: false },
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
        { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false },
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false },
        { value: true, id: 'differencesOnly', label: 'Somente divergências?: Sim', hideClose: false }
      ],
      removedDisclaimer:
        { value: '202301', id: 'period', label: 'Período: 2023/01', hideClose: false }
    };
    const mockDifferencesOnlyRemoved = {
      currentDisclaimers: [
        { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72', hideClose: false },
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
        { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false },
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false }
      ],
      removedDisclaimer:
      { value: true, id: 'differencesOnly', label: 'Somente divergências?: Sim', hideClose: false }
    };
    const mockCPFRemoved = {
      currentDisclaimers: [
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
        { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false },
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false }
      ],
      removedDisclaimer:
        { value: '337.839.850-72', id: 'cpf', label: 'CPF: 337.839.850-72', hideClose: false }
    };
    const mockLotationRemoved = {
      currentDisclaimers: [
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false },
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false }
      ],
      removedDisclaimer:
        { value: '061.9.10009', id: 'lotation', label: 'Lotação: 061.9.10009', hideClose: false }
    };
    const mockCategoriesRemoved = {
      currentDisclaimers: [
        { value: 'MAT001', id: 'registration', label: 'Matrícula: MAT001', hideClose: false }
      ],
      removedDisclaimer:
        { value: '101', id: 'categories', label: 'Categoria: 101', hideClose: false }
    };

    component.selectedFilters = mockSelectedFilters;

    component.onRemoveEvents(mockEstablishmentRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação Estabelecimento do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockEstablishmentRemoved.currentDisclaimers);

    component.onRemoveEvents(mockPeriodRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação Período do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockPeriodRemoved.currentDisclaimers);

    component.onRemoveEvents(mockDifferencesOnlyRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação "Somente Divergências?" do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockDifferencesOnlyRemoved.currentDisclaimers);

    component.onRemoveEvents(mockCPFRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação CPF do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockCPFRemoved.currentDisclaimers);

    component.onRemoveEvents(mockLotationRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação Lotação do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockLotationRemoved.currentDisclaimers);

    component.onRemoveEvents(mockCategoriesRemoved);
    expect(component.selectedFilters)
      .withContext('Deve remover informação Categoria do Filtro do Usuário conforme remoção via Disclaimer')
      .toEqual(mockCategoriesRemoved.currentDisclaimers);
  });
});


