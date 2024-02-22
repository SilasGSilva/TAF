import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { BehaviorSubject, of } from 'rxjs';
import { SocialUserFilterService } from '../../../taf-social/services/social-user-filter/social-user-filter.service';
import { SocialStatusEnvironmentResponse } from '../../models/social-status-environment-response';
import { SocialStatusEnvironmentService } from '../../services/social-status-environment/social-status-environment.service';
import { corePt } from './../../../core/i18n/core-pt';
import { sharedPt } from './../../../core/i18n/shared-pt';
import { tafSocialPt } from './../../../core/i18n/taf-social-pt';
import { MasksPipe } from './../../../shared/pipe/masks.pipe';
import { EsocialEventDetails } from './../social-monitor-models/EsocialEventDetails';
import { SocialMonitorService } from './../social-monitor.service';
import { MonitorDetailComponent } from './monitor-detail.component';
import { MonitorDetailModule } from './monitor-detail.module';
import { MonitorDetailService } from './monitor-detail.service';

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
    core: {
      'pt-BR': corePt,
    },
    shared: {
      'pt-BR': sharedPt,
    },
  },
};
const mockUserFilter = [
  {
    value: 'S-3000',
    id: 'event',
    label: 'Evento: S-3000',
    $id: '388868c7-46b9-a8dd-3881-5b6973c42dc4',
  },
  {
    value: 'D MG 01',
    id: 'branch',
    label: 'Filial: D MG 01',
    $id: '1cf1c401-418d-518e-f915-d1f2a66d7d53',
  },
];
const mockActiveRoute = {
  queryParams: of({
    event: 'S-2200',
  }),
};

xdescribe(MonitorDetailComponent.name, () => {
  let fixture: ComponentFixture<MonitorDetailComponent> = null;
  let component: MonitorDetailComponent = null;
  let socialStatusEnvironmentService: SocialStatusEnvironmentService = null;
  let monitorDetailService: MonitorDetailService = null;
  let socialMonitorService: SocialMonitorService = null;
  let socialUserFilterService: SocialUserFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MonitorDetailModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        PoI18nPipe,
        MasksPipe,
        {
          provide: ActivatedRoute,
          useValue: mockActiveRoute,
        },
      ],
    }).compileComponents();

    sessionStorage.setItem('TAFContext', 'esocial');

    fixture = TestBed.createComponent(MonitorDetailComponent);
    component = fixture.componentInstance;
    socialStatusEnvironmentService = TestBed.inject(
      SocialStatusEnvironmentService
    );
    monitorDetailService = TestBed.inject(MonitorDetailService);
    socialMonitorService = TestBed.inject(SocialMonitorService);
    socialUserFilterService = TestBed.inject(SocialUserFilterService);

    socialUserFilterService.setUserFilter(mockUserFilter);
    sessionStorage.setItem('TAFContext', 'esocial');
  });

  it(`deve criar o componente ${MonitorDetailComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`deve ocultar funcionalidade de incluir evento quando for evento que não é permitida inclusao`, fakeAsync(() => {
    const mockResponseTAFEsocialDetailTransmission: EsocialEventDetails = {
      header: [
        {
          type: 'string',
          property: 'status',
          label: 'Status',
        },
        {
          type: 'string',
          property: 'C8R_CODRUB',
          label: 'Código da Rubrica',
        },
        {
          type: 'string',
          property: 'C8R_IDTBRU',
          label: 'Ident. Tabela de Rubrica',
        },
        {
          type: 'string',
          property: 'C8R_DESRUB',
          label: 'Descrição da Rubrica',
        },
        {
          type: 'string',
          property: 'C8R_EVENTO',
          label: 'Retificação',
        },
        {
          type: 'string',
          property: 'error',
          label: '',
        },
      ],
      items: [
        {
          item: [
            {
              hasError: true,
              key: 'D MG 01 |S1010|000033|29062146490797|',
              columns: [
                {
                  property: 'status',
                  value: '3',
                },
                {
                  property: 'C8R_CODRUB',
                  value: '194                           ',
                },
                {
                  property: 'C8R_IDTBRU',
                  value: '000009  ',
                },
                {
                  property: 'C8R_DESRUB',
                  value:
                    'ADICIONAL TEMPO DE SERVICO                                                                          ',
                },
                {
                  property: 'C8R_EVENTO',
                  value: 'Não',
                },
                {
                  property: 'error',
                  value: 'error',
                },
              ],
            },
            {
              hasError: true,
              key: 'D MG 01 |S1010|000124|28102157282818|',
              columns: [
                {
                  property: 'status',
                  value: '3',
                },
                {
                  property: 'C8R_CODRUB',
                  value: 'OHGOTA01                      ',
                },
                {
                  property: 'C8R_IDTBRU',
                  value: '000003  ',
                },
                {
                  property: 'C8R_DESRUB',
                  value:
                    'DESRUB                                                                                              ',
                },
                {
                  property: 'C8R_EVENTO',
                  value: 'Não',
                },
                {
                  property: 'error',
                  value: 'error',
                },
              ],
            },
            {
              hasError: true,
              key: 'D MG 01 |S1010|000126|28102157445553|',
              columns: [
                {
                  property: 'status',
                  value: '3',
                },
                {
                  property: 'C8R_CODRUB',
                  value: 'OHGOTA03                      ',
                },
                {
                  property: 'C8R_IDTBRU',
                  value: '000003  ',
                },
                {
                  property: 'C8R_DESRUB',
                  value:
                    'DESC RUBR                                                                                           ',
                },
                {
                  property: 'C8R_EVENTO',
                  value: 'Não',
                },
                {
                  property: 'error',
                  value: 'error',
                },
              ],
            },
          ],
        },
      ],
      hasNext: false,
    };
    const mockResponseSocialStatusEnvironment: SocialStatusEnvironmentResponse = {
      versionLayoutSocial: 'layout_S_01_00_00',
      statusEnvironmentSocial: 'restrictedProduction',
      tssEntity: '000002',
      versionTSS: '12.1.27 | 3.0',
    };

    const TAFBusiness = { user: '000001', eSocialXmlId: 'TAFKEY_123456' };
    const business = JSON.stringify(TAFBusiness);
    sessionStorage.setItem('TAFBusiness', business);

    spyOn(
      socialStatusEnvironmentService,
      'getSocialStatusEnvironment'
    ).and.returnValue(of(mockResponseSocialStatusEnvironment));
    spyOn(monitorDetailService, 'getEventDetails').and.returnValue(
      of(mockResponseTAFEsocialDetailTransmission)
    );

    fixture.detectChanges();
    tick(10000);
    expect(component.disableButtonInsert(component.isButtonInsertRet))
      .withContext(`deve ocultar botao de incluir`)
      .toBeFalse();
  }));

  it(`#ngDoCheck
    deve disparar os controles de eventos para atualizar as telas de eventos`, () => {
    const mockStateMonitor = new BehaviorSubject<boolean>(true);

    spyOn(socialMonitorService, 'returnStateMonitor').and.returnValue(
      mockStateMonitor
    );
    spyOn(component.poTable, 'unselectRows');

    component.ngDoCheck();
    expect(component.showPageLoading)
      .withContext('Deve desabilitar a exibição do loading')
      .toBeFalse();
    expect(component.page)
      .withContext('Deve resetar a página de controle')
      .toBe(1);
    expect(component.showCounter)
      .withContext('Deve habilitar o contador')
      .toBeTrue();
  });

  xit('deve existir o filtro de período para S-3000', () => {
    const mockTAFFull = { tafFull: true };
    const mockActivatedRoute = of({
      event: 'S-3000',
    });
    const mockUserFilterMonitor = [
      {
        value: 'S-3000',
        id: 'event',
        label: 'Evento: S-3000',
        $id: '388868c7-46b9-a8dd-3881-5b6973c42dc4',
      },
      {
        value: 'D MG 01',
        id: 'branch',
        label: 'Filial: D MG 01',
        $id: '1cf1c401-418d-518e-f915-d1f2a66d7d53',
      },
    ];
    socialUserFilterService.setUserFilter(mockUserFilterMonitor);
    sessionStorage.setItem('TAFFull', JSON.stringify(mockTAFFull));
    TestBed.inject(ActivatedRoute).queryParams = mockActivatedRoute;

    component.ngOnInit();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isEvtExc).toBeTruthy();
    expect(component.showFilter).toBeTruthy();
    expect(component.isTAFFull).toBeTruthy();
  });

  xit('Deve existir o botão de Remover Empregador', () => {
    const mockTAFFull = { tafFull: true };
    const mockActivatedRoute = of({
      event: 'S-1000',
    });
    const mockUserFilterMonitor = [
      {
        value: 'S-1000',
        id: 'event',
        label: 'Evento: S-1000',
        $id: '388868c7-46b9-a8dd-3881-5b6973c42dc4',
      },
      {
        value: 'D MG 01',
        id: 'branch',
        label: 'Filial: D MG 01',
        $id: '1cf1c401-418d-518e-f915-d1f2a66d7d53',
      },
    ];
    socialUserFilterService.setUserFilter(mockUserFilterMonitor);
    sessionStorage.setItem('TAFFull', JSON.stringify(mockTAFFull));
    TestBed.inject(ActivatedRoute).queryParams = mockActivatedRoute;

    component.ngOnInit();
    fixture.detectChanges();
    expect(
      component.disableButtonRemoveCompanyRet(
        component.isButtonRemoveCompanyRet
      )
    ).toBeTruthy();
  });
});
