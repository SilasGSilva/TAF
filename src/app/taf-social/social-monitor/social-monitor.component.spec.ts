import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe,
  PoNotificationService,
} from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { of } from 'rxjs';
import { MockCertificateValidityService } from 'shared/certificate-validity/certificate-validity.service.spec';
import { SocialListBranchService } from '../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from '../services/social-list-event/social-list-event.service';
import { SocialUserFilterService } from '../services/social-user-filter/social-user-filter.service';
import { HttpService } from './../../core/services/http.service';
import { EventCard } from './monitor-events-cards/EventCard';
import { MonitorEventsCardsService } from './monitor-events-cards/monitor-events-cards.service';
import { SocialMonitorComponent } from './social-monitor.component';
import { SocialMonitorModule } from './social-monitor.module';
import { SocialMonitorService } from './social-monitor.service';

beforeEach(() => {
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
  sessionStorage.setItem('TAFFull', JSON.stringify(true));
  sessionStorage.setItem('TAFContext', 'esocial');
  sessionStorage.setItem('TAFCompany', company);
  sessionStorage.setItem('ERPAPPCONFIG', config);
});

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

xdescribe(SocialMonitorComponent.name, () => {
  let component: SocialMonitorComponent = null;
  let fixture: ComponentFixture<SocialMonitorComponent> = null;
  let socialListEventService: SocialListEventService = null;
  let socialListBranchService: SocialListBranchService = null;
  let cardEventsService: MonitorEventsCardsService = null;
  let poNotification: PoNotificationService = null;
  let socialUserFilterService: SocialUserFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SocialMonitorModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        SocialListEventService,
        SocialListBranchService,
        PoI18nPipe,
        SocialMonitorService,
        MonitorEventsCardsService,
        { provide: HttpService, useClass: MockCertificateValidityService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialMonitorComponent);
    component = fixture.componentInstance;
    socialListEventService = TestBed.inject(SocialListEventService);
    socialListBranchService = TestBed.inject(SocialListBranchService);
    cardEventsService = TestBed.inject(MonitorEventsCardsService);
    poNotification = TestBed.inject(PoNotificationService);
    socialUserFilterService = TestBed.inject(SocialUserFilterService);
  });

  it(`deve criar o componente ${SocialMonitorComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`#renderDetails
    deve retornar com informações dos cards filtrado por status quando solicitado Aplicar Filtros`, () => {
    const childParams = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
      },
      {
        value: '01',
        id: 'motive',
        label: 'Motivo de afastamento: 01',
      },
      {
        value: '4',
        id: 'listStatus',
        label: 'Filtrar por status: Sucesso',
      },
      {
        value: '3',
        id: 'listStatus',
        label: 'Filtrar por status: Rejeitado',
      },
      {
        value: 'S-2230',
        id: 'event',
        label: 'Evento: S-2230',
      },
      {
        value: 'D MG 01 ',
        id: 'branch',
        label: 'Filial: D MG 01 ',
      },
      {
        value: 'D RJ 02 ',
        id: 'branch',
        label: 'Filial: D RJ 02 ',
      },
      {
        value: 'M PR 02 ',
        id: 'branch',
        label: 'Filial: M PR 02 ',
      },
      {
        value: '2021-03-01',
        id: 'periodFrom',
        label: 'Data de : 01/03/2021',
      },
      {
        value: '2021-03-31',
        id: 'periodTo',
        label: 'Data até : 31/03/2021',
      },
    ];
    const mockResponseGetEvents: EventCard = {
      items: [
        {
          status: [
            {
              title: 'Pendente de Envio',
              type: '1',
              value: '0',
              warning: false,
            },
            {
              title: 'Aguardando Governo',
              type: '2',
              value: '0',
              warning: false,
            },
            {
              title: 'Rejeitado',
              type: '3',
              value: '4',
              warning: false,
            },
            {
              title: 'Sucesso',
              type: '4',
              value: '3',
              warning: false,
            },
            {
              title: 'Excluido',
              type: '5',
              value: '0',
              warning: false,
            },
          ],
          eventCode: 'S-2230',
          total: 7,
          eventDescription: 'Afastamento Temporário',
        },
      ],
    };
    const mockEventCards = [
      {
        status: [
          {
            title: 'Pendente de Envio',
            type: '1',
            value: '0',
            warning: false,
          },
          {
            title: 'Aguardando Governo',
            type: '2',
            value: '0',
            warning: false,
          },
          {
            title: 'Rejeitado',
            type: '3',
            value: '4',
            warning: false,
          },
          {
            title: 'Sucesso',
            type: '4',
            value: '3',
            warning: false,
          },
          {
            title: 'Excluido',
            type: '5',
            value: '0',
            warning: false,
          },
        ],
        eventCode: 'S-2230',
        total: 7,
        eventDescription: 'Afastamento Temporário',
        checked: false,
      },
    ];

    spyOn(cardEventsService, 'getEventsCards').and.returnValue(
      of(mockResponseGetEvents)
    );

    component.renderDetails(childParams);
    expect(component.eventCards)
      .withContext(
        'Retorna array com informações do card de evento tratados após retorno do backend'
      )
      .toEqual(mockEventCards);
  });

  it(`#getFilter
    deve carregar filtro do usuário quando for solicitado`, () => {
    const mockSessionStorageUserFilter = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
        $id: '8385cc2b-530c-80fa-4e3c-54d1a47ee50c',
      },
      {
        value: '1',
        id: 'listStatus',
        label: 'Filtrar por status: Pendente de Envio',
        $id: '8ef98961-b4f4-78a4-72b6-96ca59dda4b5',
      },
      {
        value: 'S-2200',
        id: 'event',
        label: 'Evento: S-2200',
        $id: '112a97fa-aeba-a1ff-bc78-97f643307a4d',
      },
      {
        value: 'D MG 01 ',
        id: 'branch',
        label: 'Filial: D MG 01 ',
        $id: '86e455c8-938b-d72b-082a-9d114128d5da',
      },
      {
        value: '2021-03-01',
        id: 'periodFrom',
        label: 'Data de : 01/03/2021',
        $id: '6d55ad3b-00a4-e049-2447-959df65fcc08',
      },
      {
        value: '2021-03-31',
        id: 'periodTo',
        label: 'Data até : 31/03/2021',
        $id: '86f0663f-d07a-e93f-20e9-9fbb83f4fcd4',
      },
    ];
    const mockUserFilter = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
        $id: '8385cc2b-530c-80fa-4e3c-54d1a47ee50c',
      },
      {
        value: '1',
        id: 'listStatus',
        label: 'Filtrar por status: Pendente de Envio',
        $id: '8ef98961-b4f4-78a4-72b6-96ca59dda4b5',
      },
      {
        value: 'S-2200',
        id: 'event',
        label: 'Evento: S-2200',
        $id: '112a97fa-aeba-a1ff-bc78-97f643307a4d',
      },
      {
        value: 'D MG 01 ',
        id: 'branch',
        label: 'Filial: D MG 01 ',
        $id: '86e455c8-938b-d72b-082a-9d114128d5da',
      },
      {
        value: '2021-03-01',
        id: 'periodFrom',
        label: 'Data de : 01/03/2021',
        $id: '6d55ad3b-00a4-e049-2447-959df65fcc08',
      },
      {
        value: '2021-03-31',
        id: 'periodTo',
        label: 'Data até : 31/03/2021',
        $id: '86f0663f-d07a-e93f-20e9-9fbb83f4fcd4',
      },
    ];
    const mockResponseGetEvents: EventCard = {
      items: [
        {
          status: [
            {
              title: 'Pendente de Envio',
              type: '1',
              value: '0',
              warning: false,
            },
            {
              title: 'Aguardando Governo',
              type: '2',
              value: '0',
              warning: false,
            },
            {
              title: 'Rejeitado',
              type: '3',
              value: '4',
              warning: false,
            },
            {
              title: 'Sucesso',
              type: '4',
              value: '3',
              warning: false,
            },
            {
              title: 'Excluido',
              type: '5',
              value: '0',
              warning: false,
            },
          ],
          eventCode: 'S-2230',
          total: 7,
          eventDescription: 'Afastamento Temporário',
        },
      ],
    };

    spyOn(cardEventsService, 'getEventsCards').and.returnValue(
      of(mockResponseGetEvents)
    );

    socialUserFilterService.setUserFilter(mockSessionStorageUserFilter);
    component.getFilter();

    expect(component.filters)
      .withContext(
        'Deve ter carregado as informações do User Filter corretamente'
      )
      .toEqual(mockUserFilter);
  });
});
