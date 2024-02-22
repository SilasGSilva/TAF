import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  PoButtonModule,
  PoDisclaimerGroupModule,
  PoFieldModule,
  PoI18nConfig,
  PoI18nModule,
  PoNotificationService,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { of } from 'rxjs';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from '../../services/social-list-event/social-list-event.service';
import { SocialMonitorService } from '../social-monitor.service';
import { MonitorFilterMotiveService } from './monitor-filter-motive.service';
import { MonitorFilterComponent } from './monitor-filter.component';

xdescribe(MonitorFilterComponent.name, () => {
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
  const mockListMotive = {
    items: [
      {
        motivesCode: '01',
        motivesDescription: 'ACIDENTE/DOENÇA DO TRABALHO',
      },
    ],
    hasNext: false,
  };
  const mockListBranch = {
    items: [
      {
        branchCode: 'D MG 01',
        branchDescription: ' BELO HOR',
      },
    ],
    hasNext: false,
  };
  const mockContext = 'esocial';
  const mockERPAppConfig = {
    name: 'Protheus THF',
    version: '12.23.0',
    serverBackend: '/',
    restEntryPoint: 'rest',
    versionAPI: '',
    appVersion: '0.1.6',
    productLine: 'Protheus',
    multiProtocolPort: false,
  };

  let component: MonitorFilterComponent;
  let fixture: ComponentFixture<MonitorFilterComponent>;

  beforeEach(
    waitForAsync(() => {
      sessionStorage.setItem('TAFContext', mockContext);
      sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(mockERPAppConfig));

      TestBed.configureTestingModule({
        imports: [
          PoI18nModule.config(i18nConfig),
          PoWidgetModule,
          PoFieldModule,
          PoButtonModule,
          PoDisclaimerGroupModule,
        ],
        declarations: [MonitorFilterComponent],
        providers: [
          PoNotificationService,
          UntypedFormBuilder,
          SocialMonitorService,
          {
            provide: MonitorFilterMotiveService,
            useValue: {
              getListMotives: () => of(mockListMotive),
            },
          },
          {
            provide: SocialListBranchService,
            useValue: {
              getListBranchs: () => of(mockListBranch),
            },
          },
          SocialListEventService,
          LiteralService,
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MonitorFilterComponent);
      component = fixture.componentInstance;
    })
  );

  it(`deve criar o componente ${MonitorFilterComponent.name}`, () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`#onChangeMultiSelect
    deve atualizar os array de filtros selecionados conforme seleção do usuário no MultiSelect de Filiais`, () => {
    const filialSelecionada = {
      value: 'D MG 01 ',
      label: 'Filial: D MG 01 ',
    };
    const mockSelectedFilters = [
      {
        value: 'D MG 01 ',
        id: 'branch',
        label: 'Filial: D MG 01 ',
      },
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.selectedFilters = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.onChangeMultiSelect('branch', [filialSelecionada]);

    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando a Filial: D MG 01')
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeMultiSelect
  deve atualizar os array de filtros selecionados conforme seleção do usuário no MultiSelect de Eventos`, () => {
    const eventoSelecionado = {
      value: 'S-3000',
      label: 'Evento: S-3000',
    };
    const mockSelectedFilters = [
      {
        value: 'S-3000',
        id: 'event',
        label: 'Evento: S-3000',
      },
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.selectedFilters = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.onChangeMultiSelect('event', [eventoSelecionado]);

    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando o evento S-3000')
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeMultiSelect
    deve atualizar os array de filtros selecionados conforme o filtro do usuário no Motivo de desligamento`, () => {
    const motivoSelecionado = {
      label: '01-ACIDENTE/DOENÇA DO TRABALHO',
      value: '01',
    };
    const mockSelectedmotive = [
      {
        value: '01',
        id: 'motive',
        label: 'Motivo de afastamento: 01',
      },
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.selectedFilters = [
      {
        value: '202103',
        id: 'period',
        label: 'Período: 202103',
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

    component.onChangeMultiSelect('motive', [motivoSelecionado]);

    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando a Filial: D MG 01')
      .toEqual(mockSelectedmotive);
  });

  it(`#onChangeMultiSelect
    deve atualizar os array de filtros selecionados conforme seleção do usuário no MultiSelect de Filtro por Status`, () => {
    const pendenteEnvio = {
      value: '1',
      label: 'Pendente de Envio',
    };
    const aguardandoGoverno = {
      value: '2',
      label: 'Aguardando Governo',
    };
    const rejeitado = {
      value: '3',
      label: 'Rejeitado',
    };
    const sucesso = {
      value: '4',
      label: 'Sucesso',
    };
    const excluido = {
      value: '5',
      label: 'Excluído',
    };
    const mockSelectedFiltersStatus1 = [
      {
        value: '1',
        id: 'listStatus',
        label: 'Status: Pendente de Envio',
      },
    ];
    const mockSelectedFiltersStatus234 = [
      {
        value: '2',
        id: 'listStatus',
        label: 'Status: Aguardando Governo',
      },
      {
        value: '3',
        id: 'listStatus',
        label: 'Status: Rejeitado',
      },
      {
        value: '4',
        id: 'listStatus',
        label: 'Status: Sucesso',
      },
    ];
    const mockSelectedFiltersStatusFull = [
      {
        value: '1',
        id: 'listStatus',
        label: 'Status: Pendente de Envio',
      },
      {
        value: '2',
        id: 'listStatus',
        label: 'Status: Aguardando Governo',
      },
      {
        value: '3',
        id: 'listStatus',
        label: 'Status: Rejeitado',
      },
      {
        value: '4',
        id: 'listStatus',
        label: 'Status: Sucesso',
      },
      {
        value: '5',
        id: 'listStatus',
        label: 'Status: Excluído',
      },
    ];

    component.onChangeMultiSelect('listStatus', [pendenteEnvio]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando Pendente de Envio')
      .toEqual(mockSelectedFiltersStatus1);

    component.onChangeMultiSelect('listStatus',[aguardandoGoverno, rejeitado, sucesso]);
    expect(component.selectedFilters)
      .withContext(
        'Simula usuário selecionando Aguardando Governo, Rejeitado e Sucesso'
      )
      .toEqual(mockSelectedFiltersStatus234);

    component.onChangeMultiSelect('listStatus',[
      pendenteEnvio,
      aguardandoGoverno,
      rejeitado,
      sucesso,
      excluido,
    ]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando todos os status de eventos')
      .toEqual(mockSelectedFiltersStatusFull);
  });

  it(`#onChangeDisclaimerSelect
    deve atualizar os campos do elemento Disclaimer conforme filtros selecionados pelo usuário quando chamado`, () => {
    const mockSelectedFilters = [
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
        value: '3',
        id: 'listStatus',
        label: 'Status: Rejeitado',
      },
      {
        value: '4',
        id: 'listStatus',
        label: 'Status: Sucesso',
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
    const eventPoMultiSelect = ['S-2230'];
    const branchPoMultiSelect = ['D MG 01 ', 'D RJ 02 ', 'M PR 02 '];
    const motivePoMultiSelect = ['01'];
    const listStatusPoMultiSelect = ['3', '4'];

    component.selectedFilters = mockSelectedFilters;

    component.onChangeDisclaimerSelect();

    expect(component.formFilter.get('event').value)
      .withContext(
        'MultiSelect de Eventos deve estar preenchido com o valor atualizado do Disclaimer'
      )
      .toEqual(eventPoMultiSelect);

    expect(component.formFilter.get('branch').value)
      .withContext(
        'MultiSelect de Filiais deve estar preenchido com o valor atualizado do Disclaimer'
      )
      .toEqual(branchPoMultiSelect);

    expect(component.formFilter.get('motive').value)
      .withContext(
        'MultiSelect de Motivos de Afastamento deve estar preenchido com o valor atualizado do Disclaimer'
      )
      .toEqual(motivePoMultiSelect);

    expect(component.formFilter.get('listStatus').value)
      .withContext(
        'MultiSelect de Status deve estar preenchido com o valor atualizado do Disclaimer'
      )
      .toEqual(listStatusPoMultiSelect);
  });

  it(`#onChangePeriod
    deve controlar preenchimento dos campos Periodo De e Periodo Até conforme o campo Período quando o usuário preencher data no campo Período`, () => {
    const inputDate = '202103';

    component.formFilter.get('period').setValue(inputDate);
    component.onChangePeriod(inputDate);

    expect(component.formFilter.get('periodFrom').value)
      .withContext('Deve ser calculada data inicial do período em questão')
      .toEqual('2021-03-01');

    expect(component.formFilter.get('periodTo').value)
      .withContext('Deve ser calculada data final do período em questão')
      .toEqual('2021-03-31');

    component.onChangePeriod('99');

    expect(component.formFilter.get('period').value).withContext(
      'Período De deve ter valor em branco devido a período inválido'
    ).toBeNull;

    expect(component.formFilter.get('periodFrom').value).withContext(
      'Período De deve ter valor em branco devido a período inválido'
    ).toBeNull;

    expect(component.formFilter.get('periodTo').value).withContext(
      'Período Até deve ter valor em branco devido a período inválido'
    ).toBeNull;
  });

  it(`#validPeriod
  deve atualizar a Data De e Data Ate no Disclaimer quando o incluído valor nesses campos pelo usuário`, () => {
    const mockSelectedFilters = [
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
    const dateFrom: Object = new String('01/03/2021');
    const periodTypeFrom = 'periodFrom';
    const dateTo: Object = new String('31/03/2021');
    const periodTypeTo = 'periodTo';

    component.validPeriod(dateFrom, periodTypeFrom);
    component.validPeriod(dateTo, periodTypeTo);

    expect(component.selectedFilters)
      .withContext(
        'Deve ter SelectedFilters atualizado com Data de e Data até informada pelo usuário'
      )
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeMultiSelect
    deve atualizar os array de filtros selecionados conforme seleção do usuário no MultiSelect de Filtro por Grupo de Eventos`, () => {
    const tabelas = {
      value: 'C',
      label: 'Tabelas',
    };
    const periodicos = {
      value: 'M',
      label: 'Periódicos',
    };
    const naoPeriodicos = {
      value: 'E',
      label: 'Não Periódicos',
    };
    const sst = {
      value: 'S',
      label: 'SST',
    };
    const orgaosPublicos = {
      value: 'O',
      label: 'Órgãos Públicos',
    };
    const totalizadores = {
      value: 'T',
      label: 'Totalizadores',
    };

    const mockonChangeEventGroupsC = [
      {
        value: 'C',
        id: 'filEventGroups',
        label: 'Grupos: Tabelas',
      },
    ];

    const mockonChangeEventGroupsM = [
      {
        value: 'M',
        id: 'filEventGroups',
        label: 'Grupos: Periódicos',
      },
    ];

    const mockonChangeEventGroupsMC = [
      {
        value: 'M',
        id: 'filEventGroups',
        label: 'Grupos: Periódicos',
      },
      {
        value: 'C',
        id: 'filEventGroups',
        label: 'Grupos: Tabelas',
      },
    ];

    const mockonChangeEventGroupsMES = [
      {
        value: 'M',
        id: 'filEventGroups',
        label: 'Grupos: Periódicos',
      },
      {
        value: 'E',
        id: 'filEventGroups',
        label: 'Grupos: Não Periódicos',
      },
      {
        value: 'S',
        id: 'filEventGroups',
        label: 'Grupos: SST',
      },
    ];
    const mockSelectedFiltersGroupsFull = [
      {
        value: 'C',
        id: 'filEventGroups',
        label: 'Grupos: Tabelas',
      },
      {
        value: 'M',
        id: 'filEventGroups',
        label: 'Grupos: Periódicos',
      },
      {
        value: 'E',
        id: 'filEventGroups',
        label: 'Grupos: Não Periódicos',
      },
      {
        value: 'S',
        id: 'filEventGroups',
        label: 'Grupos: SST',
      },
      {
        value: 'O',
        id: 'filEventGroups',
        label: 'Grupos: Órgãos Públicos',
      },
      {
        value: 'T',
        id: 'filEventGroups',
        label: 'Grupos: Totalizadores',
      },
    ];

    component.onChangeMultiSelect('filEventGroups', [tabelas]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando Tabelas')
      .toEqual(mockonChangeEventGroupsC);

    component.onChangeMultiSelect('filEventGroups', [periodicos]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando Periódicos')
      .toEqual(mockonChangeEventGroupsM);

    component.onChangeMultiSelect('filEventGroups', [periodicos, tabelas]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando Periódicos')
      .toEqual(mockonChangeEventGroupsMC);

    component.onChangeMultiSelect('filEventGroups', [periodicos, naoPeriodicos, sst]);
    expect(component.selectedFilters)
      .withContext(
        'Simula usuário selecionando Periódicos, Não Periódicos e SST'
      )
      .toEqual(mockonChangeEventGroupsMES);

    component.onChangeMultiSelect('filEventGroups',[
      tabelas,
      periodicos,
      naoPeriodicos,
      sst,
      orgaosPublicos,
      totalizadores,
    ]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando todos os grupos de eventos')
      .toEqual(mockSelectedFiltersGroupsFull);

    component.onChangeMultiSelect('filEventGroups', []);
    expect(component.selectedFilters)
      .withContext('Simula usuário sem selecionar filtro de Grupo de eventos')
      .toEqual([]);

    component.onChangeMultiSelect('filEventGroups', [tabelas]);
    expect(component.selectedFilters)
      .withContext('Simula usuário selecionando Tabelas')
      .toEqual(mockonChangeEventGroupsC);
  });

  it(`Verifica se o botão de filtro por Grupo de Evento foi criado`, () => {
    component.isTAFFull = true;

    const modalEl: HTMLElement = fixture.nativeElement.querySelector(
      'po-multiselect[name=filEventGroups]'
    );
    expect(modalEl).withContext('Deve haver o filtro por Grupo de Eventos').not
      .toBeNull;
  });

  it(`#onClean()
    deve resetar campos do formulario e controlar liberacao do botao de Aplicar Filtro quando o usuario excluir itens do disclaimer`, () => {
      component.onClean();
    
    expect(component.selectedFilters)
      .withContext('Deve resetar todos os campos do filtro')
      .toHaveSize(0);
  });
});
