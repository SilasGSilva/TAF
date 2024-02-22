import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe,
  PoMultiselectOption,
} from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { of } from 'rxjs';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from '../../services/social-list-event/social-list-event.service';
import { BranchResponse } from './../../models/BranchResponse';
import { EventResponse } from './../../models/EventResponse';
import { AuditChartSeriesResponse } from './../social-audit-models/AuditChartSeriesResponse';
import { AuditExecuteResponse } from './../social-audit-models/AuditExecuteResponse';
import { AuditStatusResponse } from './../social-audit-models/AuditStatusResponse';
import { AuditValuesResponse } from './../social-audit-models/AuditValuesResponse';
import { AuditFilterComponent } from './audit-filter.component';
import { AuditFilterModule } from './audit-filter.module';
import { AuditService } from './services/audit.service';

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
const branch: Array<string> = ['D MG 01', 'D RJ 02', 'M PR 02'];
const event: Array<string> = ['S-1202'];
const transmission: Array<string> = ['1', '2'];
const deadline: Array<string> = ['1', '2'];
const period = '202112';
const periodFrom = '2021-12-01';
const periodTo = '2021-12-31';

xdescribe(AuditFilterComponent.name, () => {
  let component: AuditFilterComponent = null;
  let fixture: ComponentFixture<AuditFilterComponent> = null;
  let auditService: AuditService = null;
  let eventService: SocialListEventService = null;
  let branchService: SocialListBranchService = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFilterModule, PoI18nModule.config(i18nConfig)],
      providers: [PoI18nPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditFilterComponent);
    component = fixture.componentInstance;
    auditService = TestBed.inject(AuditService);
    eventService = TestBed.inject(SocialListEventService);
    branchService = TestBed.inject(SocialListBranchService);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const tafFull = true;
    const tafContext = 'esocial';

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
    sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    sessionStorage.setItem('TAFContext', tafContext);
  });

  it(`deve criar o componente ${AuditFilterComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`deve carregar os campos multiSelect na inicialização do componente corretamente quando solicitado`, done => {
    const mockResponseBranchService: BranchResponse = {
      items: [
        { branchCode: 'D MG 01', branchDescription: ' BELO HOR' },
        { branchCode: 'D RJ 02', branchDescription: ' NITEROI' },
        { branchCode: 'M PR 02', branchDescription: ' CASCAVEL' },
      ],
      hasNext: false,
    };
    const mockResponseEventService: EventResponse = {
      items: [
        {
          eventCode: 'S-1000',
          permissionEvent: true,
          eventDescription:
            'INFORMAÇÕES DO EMPREGADOR/CONTRIBUINTE/ÓRGÃO PÚBLICO',
        },
        {
          eventCode: 'S-1005',
          permissionEvent: true,
          eventDescription:
            'TABELA DE ESTABELECIMENTOS - OBRAS DE CONSTRUÇÃO CIVIL OU UNIDADES DE ÓRGÃO PÚBLICOS',
        },
        {
          eventCode: 'S-1010',
          permissionEvent: true,
          eventDescription: 'TABELA DE RUBRICAS',
        },
        {
          eventCode: 'S-1020',
          permissionEvent: true,
          eventDescription: 'TABELA DE LOTAÇÕES TRIBUTÁRIAS',
        },
        {
          eventCode: 'S-1030',
          permissionEvent: true,
          eventDescription: 'TABELA DE CARGOS/EMPREGOS PÚBLICOS',
        },
        {
          eventCode: 'S-1035',
          permissionEvent: true,
          eventDescription: 'TABELA DE CARREIRAS PÚBLICAS',
        },
        {
          eventCode: 'S-1040',
          permissionEvent: true,
          eventDescription: 'TABELA DE FUNÇÕES/CARGOS EM COMISSÃO',
        },
        {
          eventCode: 'S-1050',
          permissionEvent: true,
          eventDescription: 'TABELA DE HORÁRIOS/TURNOS DE TRABALHO',
        },
        {
          eventCode: 'S-1060',
          permissionEvent: true,
          eventDescription: 'TABELA DE AMBIENTES DE TRABALHO',
        },
        {
          eventCode: 'S-1070',
          permissionEvent: true,
          eventDescription: 'TABELA DE PROCESSOS ADMINISTRATIVOS/JUDICIAIS',
        },
        {
          eventCode: 'S-1080',
          permissionEvent: true,
          eventDescription: 'TABELA DE OPERADORES PORTUÁRIOS',
        },
        {
          eventCode: 'S-1200',
          permissionEvent: false,
          eventDescription:
            'REMUNERAÇÃO DO TRABALHADOR VINCULADO AO REGIME GERAL DE PREVIDÊNCIA SOCIAL - RGPS',
        },
        {
          eventCode: 'S-1202',
          permissionEvent: true,
          eventDescription:
            'REMUNERAÇÃO DE SERVIDOR VINCULADO AO REGIME PRÓPRIO DE PREVID. SOCIAL',
        },
        {
          eventCode: 'S-1207',
          permissionEvent: true,
          eventDescription: 'BENEFÍCIOS - ENTES PÚBLICOS',
        },
        {
          eventCode: 'S-1210',
          permissionEvent: true,
          eventDescription: 'PAGAMENTOS DE RENDIMENTOS DO TRABALHO',
        },
        {
          eventCode: 'S-1250',
          permissionEvent: true,
          eventDescription: 'AQUISIÇÃO DE PRODUÇÃO RURAL',
        },
        {
          eventCode: 'S-1260',
          permissionEvent: true,
          eventDescription: 'COMERCIALIZAÇÃO DA PRODUÇÃO RURAL PESSOA FÍSICA',
        },
        {
          eventCode: 'S-1270',
          permissionEvent: true,
          eventDescription:
            'CONTRATAÇÃO DE TRABALHADORES AVULSOS NÃO PORTUÁRIOS',
        },
        {
          eventCode: 'S-1280',
          permissionEvent: true,
          eventDescription: 'INFORMAÇÕES COMPLEMENTARES AOS EVENTOS PERIÓDICOS',
        },
        {
          eventCode: 'S-1295',
          permissionEvent: true,
          eventDescription:
            'SOLICITAÇÃO DE TOTALIZAÇÃO PARA PAGAMENTO EM CONTINGÊNCIA',
        },
        {
          eventCode: 'S-1298',
          permissionEvent: true,
          eventDescription: 'REABERTURA DOS EVENTOS PERIÓDICOS',
        },
        {
          eventCode: 'S-1299',
          permissionEvent: true,
          eventDescription: 'FECHAMENTO DOS EVENTOS PERIÓDICOS',
        },
        {
          eventCode: 'S-1300',
          permissionEvent: true,
          eventDescription: 'CONTRIBUIÇÃO SINDICAL PATRONAL',
        },
        {
          eventCode: 'S-2190',
          permissionEvent: true,
          eventDescription: 'REGISTRO PRELIMINAR DE TRABALHADOR',
        },
        {
          eventCode: 'S-2200',
          permissionEvent: true,
          eventDescription:
            'CADASTRAMENTO INICIAL DO VÍNCULO E ADMISSÃO/INGRESSO DE TRABALHADOR',
        },
        {
          eventCode: 'S-2205',
          permissionEvent: true,
          eventDescription: 'ALTERAÇÃO DE DADOS CADASTRAIS DO TRABALHADOR',
        },
        {
          eventCode: 'S-2206',
          permissionEvent: true,
          eventDescription:
            'ALTERAÇÃO DE CONTRATO DE TRABALHO/RELAÇÃO ESTATUTÁRIA',
        },
        {
          eventCode: 'S-2210',
          permissionEvent: true,
          eventDescription: 'COMUNICAÇÃO DE ACIDENTE DE TRABALHO',
        },
        {
          eventCode: 'S-2220',
          permissionEvent: true,
          eventDescription: 'MONITORAMENTO DA SAÚDE DO TRABALHADOR',
        },
        {
          eventCode: 'S-2221',
          permissionEvent: true,
          eventDescription: 'EXAME TOXICOLÓGICO DO MOTORISTA PROFISSIONAL',
        },
        {
          eventCode: 'S-2230',
          permissionEvent: true,
          eventDescription: 'AFASTAMENTO TEMPORÁRIO',
        },
        {
          eventCode: 'S-2231',
          permissionEvent: true,
          eventDescription: 'CESSÃO/EXERCÍCIO EM OUTRO ÓRGÃO',
        },
        {
          eventCode: 'S-2240',
          permissionEvent: true,
          eventDescription:
            'CONDIÇÕES AMBIENTAIS DO TRABALHO - AGENTES NOCIVOS',
        },
        {
          eventCode: 'S-2241',
          permissionEvent: true,
          eventDescription:
            'INSALUBRIDADE - PERICULOSIDADE E APOSENTADORIA ESPECIAL',
        },
        {
          eventCode: 'S-2245',
          permissionEvent: true,
          eventDescription:
            'TREINAMENTOS CAPACITAÇÕES EXERCÍCIOS SIMULADOS E OUTRAS ANOTAÇÕES',
        },
        {
          eventCode: 'S-2250',
          permissionEvent: true,
          eventDescription: 'AVISO PRÉVIO',
        },
        {
          eventCode: 'S-2298',
          permissionEvent: true,
          eventDescription: 'REINTEGRAÇÃO/OUTROS PROVIMENTOS',
        },
        {
          eventCode: 'S-2299',
          permissionEvent: false,
          eventDescription: 'DESLIGAMENTO',
        },
        {
          eventCode: 'S-2300',
          permissionEvent: true,
          eventDescription:
            'TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - INICIO',
        },
        {
          eventCode: 'S-2306',
          permissionEvent: true,
          eventDescription:
            'TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - ALT. CONTRATUAL',
        },
        {
          eventCode: 'S-2399',
          permissionEvent: false,
          eventDescription:
            'TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - TÉRMINO',
        },
        {
          eventCode: 'S-2400',
          permissionEvent: true,
          eventDescription:
            'CADASTRO DE BENEFICIÁRIO - ENTES PÚBLICOS - INÍCIO',
        },
        {
          eventCode: 'S-2405',
          permissionEvent: true,
          eventDescription:
            'CADASTRO DE BENEFICIÁRIO - ENTES PÚBLICOS - ALTERAÇÃO',
        },
        {
          eventCode: 'S-2410',
          permissionEvent: true,
          eventDescription: 'CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - INÍCIO',
        },
        {
          eventCode: 'S-2416',
          permissionEvent: true,
          eventDescription:
            'CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - ALTERAÇÃO',
        },
        {
          eventCode: 'S-2418',
          permissionEvent: true,
          eventDescription: 'REATIVAÇÃO DE BENEFÍCIO - ENTES PÚBLICOS',
        },
        {
          eventCode: 'S-2420',
          permissionEvent: true,
          eventDescription: 'CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - TÉRMINO',
        },
        {
          eventCode: 'S-3000',
          permissionEvent: true,
          eventDescription: 'EXCLUSÃO DE EVENTOS',
        },
        {
          eventCode: 'S-5001',
          permissionEvent: true,
          eventDescription:
            'INFORMAÇÕES DAS CONTRIBUIÇÕES SOCIAIS POR TRABALHADOR',
        },
        {
          eventCode: 'S-5002',
          permissionEvent: true,
          eventDescription: 'IMPOSTO DE RENDA RETIDO NA FONTE POR TRABALHADOR',
        },
        {
          eventCode: 'S-5003',
          permissionEvent: true,
          eventDescription: 'INFORMAÇÕES DO FGTS POR TRABALHADOR',
        },
        {
          eventCode: 'S-5011',
          permissionEvent: true,
          eventDescription:
            'INFORMAÇÕES DAS CONTRIBUIÇÕES SOCIAIS CONSOLIDADAS POR CONTRIBUINTE',
        },
        {
          eventCode: 'S-5012',
          permissionEvent: true,
          eventDescription: 'INFORMAÇÕES DO IRRF CONSOLIDADAS POR CONTRIBUINTE',
        },
        {
          eventCode: 'S-5013',
          permissionEvent: true,
          eventDescription: 'INFORMAÇÕES DO FGTS CONSOLIDADAS POR CONTRIBUINTE',
        },
        {
          eventCode: 'S-2260',
          permissionEvent: true,
          eventDescription: 'CONVOCAÇÃO PARA TRABALHO INTERMITENTE',
        },
      ],
    };
    const mockListBranch: Array<PoMultiselectOption> = [
      { label: 'D MG 01- BELO HOR', value: 'D MG 01' },
      { label: 'D RJ 02- NITEROI', value: 'D RJ 02' },
      { label: 'M PR 02- CASCAVEL', value: 'M PR 02' },
    ];
    const mockListEvent: Array<PoMultiselectOption> = [
      {
        value: 'S-1202',
        label:
          'S-1202 - REMUNERAÇÃO DE SERVIDOR VINCULADO AO REGIME PRÓPRIO DE PREVID. SOCIAL',
      },
      { value: 'S-1207', label: 'S-1207 - BENEFÍCIOS - ENTES PÚBLICOS' },
      {
        value: 'S-1210',
        label: 'S-1210 - PAGAMENTOS DE RENDIMENTOS DO TRABALHO',
      },
      {
        value: 'S-1260',
        label: 'S-1260 - COMERCIALIZAÇÃO DA PRODUÇÃO RURAL PESSOA FÍSICA',
      },
      {
        value: 'S-1270',
        label: 'S-1270 - CONTRATAÇÃO DE TRABALHADORES AVULSOS NÃO PORTUÁRIOS',
      },
      {
        value: 'S-1280',
        label: 'S-1280 - INFORMAÇÕES COMPLEMENTARES AOS EVENTOS PERIÓDICOS',
      },
      {
        value: 'S-1295',
        label:
          'S-1295 - SOLICITAÇÃO DE TOTALIZAÇÃO PARA PAGAMENTO EM CONTINGÊNCIA',
      },
      { value: 'S-1299', label: 'S-1299 - FECHAMENTO DOS EVENTOS PERIÓDICOS' },
      { value: 'S-2190', label: 'S-2190 - REGISTRO PRELIMINAR DE TRABALHADOR' },
      {
        value: 'S-2200',
        label:
          'S-2200 - CADASTRAMENTO INICIAL DO VÍNCULO E ADMISSÃO/INGRESSO DE TRABALHADOR',
      },
      {
        value: 'S-2205',
        label: 'S-2205 - ALTERAÇÃO DE DADOS CADASTRAIS DO TRABALHADOR',
      },
      {
        value: 'S-2206',
        label: 'S-2206 - ALTERAÇÃO DE CONTRATO DE TRABALHO/RELAÇÃO ESTATUTÁRIA',
      },
      {
        value: 'S-2210',
        label: 'S-2210 - COMUNICAÇÃO DE ACIDENTE DE TRABALHO',
      },
      {
        value: 'S-2220',
        label: 'S-2220 - MONITORAMENTO DA SAÚDE DO TRABALHADOR',
      },
      { value: 'S-2230', label: 'S-2230 - AFASTAMENTO TEMPORÁRIO' },
      { value: 'S-2231', label: 'S-2231 - CESSÃO/EXERCÍCIO EM OUTRO ÓRGÃO' },
      {
        value: 'S-2240',
        label: 'S-2240 - CONDIÇÕES AMBIENTAIS DO TRABALHO - AGENTES NOCIVOS',
      },
      {
        value: 'S-2241',
        label:
          'S-2241 - INSALUBRIDADE - PERICULOSIDADE E APOSENTADORIA ESPECIAL',
      },
      {
        value: 'S-2245',
        label:
          'S-2245 - TREINAMENTOS CAPACITAÇÕES EXERCÍCIOS SIMULADOS E OUTRAS ANOTAÇÕES',
      },
      { value: 'S-2298', label: 'S-2298 - REINTEGRAÇÃO/OUTROS PROVIMENTOS' },
      {
        value: 'S-2300',
        label:
          'S-2300 - TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - INICIO',
      },
      {
        value: 'S-2306',
        label:
          'S-2306 - TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - ALT. CONTRATUAL',
      },
      {
        value: 'S-2400',
        label: 'S-2400 - CADASTRO DE BENEFICIÁRIO - ENTES PÚBLICOS - INÍCIO',
      },
      {
        value: 'S-2405',
        label: 'S-2405 - CADASTRO DE BENEFICIÁRIO - ENTES PÚBLICOS - ALTERAÇÃO',
      },
      {
        value: 'S-2410',
        label: 'S-2410 - CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - INÍCIO',
      },
      {
        value: 'S-2416',
        label: 'S-2416 - CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - ALTERAÇÃO',
      },
      {
        value: 'S-2418',
        label: 'S-2418 - REATIVAÇÃO DE BENEFÍCIO - ENTES PÚBLICOS',
      },
      {
        value: 'S-2420',
        label: 'S-2420 - CADASTRO DE BENEFÍCIO - ENTES PÚBLICOS - TÉRMINO',
      },
    ];
    const mockListEventNonAuth: Array<Object> = [
      {
        value: 'S-1200',
        label:
          'S-1200 - REMUNERAÇÃO DO TRABALHADOR VINCULADO AO REGIME GERAL DE PREVIDÊNCIA SOCIAL - RGPS',
      },
      { value: 'S-2299', label: 'S-2299 - DESLIGAMENTO' },
      {
        value: 'S-2399',
        label:
          'S-2399 - TRABALHADOR SEM VÍNCULO DE EMPREGADO/ESTATUTÁRIO - TÉRMINO',
      },
    ];

    const spyBranchService = spyOn(
      branchService,
      'getListBranchs'
    ).and.returnValue(of(mockResponseBranchService));
    const spyEventService = spyOn(
      eventService,
      'getListEvents'
    ).and.returnValue(of(mockResponseEventService));

    component.ngOnInit();

    spyBranchService.calls
      .mostRecent()
      .returnValue.toPromise()
      .then(() => {
        fixture.detectChanges();

        expect(component.listBranch)
          .withContext(
            'Deve conter os itens do multiSelect de Filiais corretamente'
          )
          .toEqual(mockListBranch);
        done();
      });

    spyEventService.calls
      .mostRecent()
      .returnValue.toPromise()
      .then(() => {
        fixture.detectChanges();

        expect(component.listEvent)
          .withContext(
            `Deve conter os itens do multiSelect de Eventos corretamente
        excetuando Eventos Não Autorizados ao Usuário e Eventos Não Auditáveis`
          )
          .toEqual(mockListEvent);

        expect(component.listEventNonAuth)
          .withContext(
            `Deve conter os eventos que o usuário não tem autorização, quando ocorrer`
          )
          .toEqual(mockListEventNonAuth);

        const popOverEl: HTMLElement = fixture.nativeElement.querySelector(
          '[class="po-font-text-large-bold po-m-1 redColor"]'
        );
        expect(popOverEl.textContent.trim())
          .withContext(
            'Deve haver um ícone de alerta e mensagem indicando quais eventos foram retirados'
          )
          .toContain('S-1200, S-2299, S-2399');
        done();
      });
  });

  it(`deve requisitar mais dados da API de auditoria quando solicitado`, () => {
    const responseReportTable: AuditValuesResponse = {
      items: [
        {
          branch: 'D MG 01',
          cpf: '737.565.170-12',
          dateTrans: 'N/A',
          deadline: '15/01/22',
          deadlineDescription:
            'Até o dia 15 do mês subsequente ao mês de referência do evento.',
          eventDescription:
            'S-1200 - MENSAL - REMUNERAÇÃO DO TRABALHADOR VINCULADO AO REGIME GERAL DE PREVIDÊNCIA SOCIAL - RGPS',
          indApur: 'FOLHA DE PAGAMENTO MENSAL',
          name: 'JOSE CICERO DE ALMEIDA',
          periodEvent: '12/2021',
          receipt: '1.123456789',
          registration: 'N/A',
          ruleDescription: 'Apuração Mensal',
          status: '3',
          transmissionObservation:
            'Neste evento foi utilizado a funcionalidade de ajuste de recibo, sua data de transmissão não foi informada e pode gerar divergencias.',
          typeOrigin: 'INCLUSÃO',
          establishment: '53113791000122',
          processNumber: '98504531120235002674',
        },
      ],
      hasNext: true,
    };

    component.showMore = true;
    spyOn(auditService, 'getValuesAudit').and.returnValue(
      of(responseReportTable)
    );
    spyOn(component.payloadAuditTable, 'emit');

    component.ngOnChanges();
    expect(component.payloadAuditTable.emit)
      .withContext(
        'Deve emitir um evento com o retorno da API de auditoria corretamente'
      )
      .toHaveBeenCalledWith(responseReportTable);
  });

  it(`#onChangePeriod
    deve preencher o campo Data De e Data Ate com respectivos primeiro e último dia do mês quando o campo Período for preenchido com valor válido`, fakeAsync(() => {
    const period = '202111';
    component.formFilter.get('period').setValue(period);

    component.onChangePeriod(period);
    expect(component.formFilter.get('periodFrom').value)
      .withContext(
        'Deve preencher o campo Data De com início do mês do campo Período'
      )
      .toBe('2021-11-01');
    expect(component.formFilter.get('periodTo').value)
      .withContext(
        'Deve preencher o campo Data Ate com final do mês do campo Período'
      )
      .toBe('2021-11-30');
  }));

  it(`#onChangePeriod
    deve resetar o campo Data De e Data Ate quando o campo Período for preenchido com vazio`, fakeAsync(() => {
    const period = '';
    component.formFilter.get('period').setValue(period);

    component.onChangePeriod(period);
    expect(component.formFilter.get('periodFrom').value)
      .withContext('Deve resetar campo Data De')
      .toBe('--01');
    expect(component.formFilter.get('periodTo').value)
      .withContext('Deve resetar campo Data Ate')
      .toBe('--31');
  }));

  it(`#onChangePeriod
    deve preencher campo Data De e Data Ate com primeiro e ultimo dia do ano solicitado quando o campo Período for preenchido somente com ano`, fakeAsync(() => {
    const period = '2021';
    component.formFilter.get('period').setValue(period);

    component.onChangePeriod(period);
    expect(component.formFilter.get('periodFrom').value)
      .withContext(
        'Deve preencher campo Data De com a data de primeiro de janeiro do ano solicitado'
      )
      .toBe('2021-01-01');
    expect(component.formFilter.get('periodTo').value)
      .withContext(
        'Deve preencher campo Data Ate com a data de trinta e um de dezembro do ano solicitado'
      )
      .toBe('2021-12-31');
  }));

  it(`#onChangeNotPeriodics
    deve preencher/atualizar a informacao do campo Data De e Data Ate no array que alimenta o disclaimer quando solicitado`, () => {
    const mockSelectedFilters: Array<Object> = [
      { value: 'S-1202', id: 'event', label: 'Evento: S-1202' },
      { value: 'D MG 01', id: 'branch', label: 'Filial: D MG 01- BELO HOR' },
      { value: 'D RJ 02', id: 'branch', label: 'Filial: D RJ 02- NITEROI' },
      { value: 'M PR 02', id: 'branch', label: 'Filial: M PR 02- CASCAVEL' },
      { value: '2021/12', id: 'period', label: 'Período: 2021/12' },
      { value: '2021-12-01', id: 'periodFrom', label: 'Data de : 01/12/2021' },
      { value: '2021-12-31', id: 'periodTo', label: 'Data até : 31/12/2021' },
    ];
    component.selectedFilters = [
      { value: 'S-1202', id: 'event', label: 'Evento: S-1202' },
      { value: 'D MG 01', id: 'branch', label: 'Filial: D MG 01- BELO HOR' },
      { value: 'D RJ 02', id: 'branch', label: 'Filial: D RJ 02- NITEROI' },
      { value: 'M PR 02', id: 'branch', label: 'Filial: M PR 02- CASCAVEL' },
      { value: '2021/12', id: 'period', label: 'Período: 2021/12' },
    ];
    const includeDate: Object = {
      periodFrom: '01/12/2021',
      periodTo: '31/12/2021',
    };
    const updateDate: Object = {
      periodFrom: '01/01/2022',
      periodTo: '31/01/2022',
    };

    component.onChangeNotPeriodics(includeDate['periodFrom'], 'periodFrom');
    component.onChangeNotPeriodics(includeDate['periodTo'], 'periodTo');
    expect(component.selectedFilters)
      .withContext(
        'Deve incluir Data De e Data Ate no array que alimenta o disclaimer'
      )
      .toEqual(mockSelectedFilters);

    mockSelectedFilters.forEach(element => {
      if (element['id'] === 'periodFrom') {
        element['value'] = '2022-01-01';
        element['label'] = 'Data de : 01/01/2022';
      } else if (element['id'] === 'periodTo') {
        element['value'] = '2022-01-31';
        element['label'] = 'Data até : 31/01/2022';
      }
    });
    component.onChangeNotPeriodics(updateDate['periodFrom'], 'periodFrom');
    component.onChangeNotPeriodics(updateDate['periodTo'], 'periodTo');
    expect(component.selectedFilters)
      .withContext(
        'Deve atualizar Data De e Data Ate no array que alimenta o disclaimer'
      )
      .toEqual(mockSelectedFilters);
  });

  it(`#onChangeDisclaimerSelect
    deve resetar campos do formulario e controlar liberacao do botao de Aplicar Filtro quando o usuario excluir itens do disclaimer`, () => {
    component.formFilter.get('branch').setValue(branch);
    component.formFilter.get('period').setValue(period);
    component.formFilter.get('event').setValue(event);
    component.formFilter.get('transmission').setValue(transmission);
    component.formFilter.get('deadline').setValue(deadline);
    component.formFilter.get('periodFrom').setValue(periodFrom);
    component.formFilter.get('periodTo').setValue(periodTo);
    component.disableButtonApplyFilters = false;

    component.onChangeDisclaimerSelect();

    expect(component.disableButtonApplyFilters)
      .withContext(
        'Deve desabilitar botão de Aplicar Filtros quando não houver campos obrigatórios preenchidos'
      )
      .toBeTrue();
    expect(component.formFilter.get('branch').value)
      .withContext('Deve resetar campo de formulário -> Filiais')
      .toHaveSize(0);
    expect(component.formFilter.get('period').value).withContext(
      'Deve resetar campo de formulário -> Período'
    ).toBeUndefined;
    expect(component.formFilter.get('periodFrom').value).withContext(
      'Deve resetar campo de formulário -> Date de'
    ).toBeUndefined;
    expect(component.formFilter.get('periodTo').value).withContext(
      'Deve resetar campo de formulário -> Data até'
    ).toBeUndefined;
    expect(component.formFilter.get('event').value)
      .withContext('Deve resetar campo de formulário -> Eventos')
      .toHaveSize(0);
    expect(component.formFilter.get('transmission').value)
      .withContext('Deve resetar campo de formulário -> Transmissão')
      .toHaveSize(0);
    expect(component.formFilter.get('deadline').value)
      .withContext('Deve resetar campo de formulário -> Prazo')
      .toHaveSize(0);
  });

  it(`#onChangeDisclaimerSelect
    deve atualizar campos do formulario e controlar liberacao do botao de Aplicar Filtro a medida que o usuário preenche as informações`, () => {
    component.selectedFilters = [
      { value: '1', id: 'deadline', label: 'Prazo: Dentro do prazo' },
      { value: '2', id: 'deadline', label: 'Prazo: Fora do prazo' },
      { value: '1', id: 'transmission', label: 'Transmissão: Transmitidos' },
      {
        value: '2',
        id: 'transmission',
        label: 'Transmissão: Não Transmitidos',
      },
      { value: 'S-1202', id: 'event', label: 'Evento: S-1202' },
      { value: 'D MG 01', id: 'branch', label: 'Filial: D MG 01- BELO HOR' },
      { value: 'D RJ 02', id: 'branch', label: 'Filial: D RJ 02- NITEROI' },
      { value: 'M PR 02', id: 'branch', label: 'Filial: M PR 02- CASCAVEL' },
      { value: '2021/12', id: 'period', label: 'Período: 2021/12' },
      { value: '2021-12-01', id: 'periodFrom', label: 'Data de : 01/12/2021' },
      { value: '2021-12-31', id: 'periodTo', label: 'Data até : 31/12/2021' },
    ];
    component.disableButtonApplyFilters = true;

    component.onChangeDisclaimerSelect();

    expect(component.formFilter.get('branch').value)
      .withContext('Deve atualizar campo de formulário -> Filiais')
      .toEqual(branch);
    expect(component.formFilter.get('event').value)
      .withContext('Deve atualizar campo de formulário -> Eventos')
      .toEqual(event);
    expect(component.formFilter.get('transmission').value)
      .withContext('Deve atualizar campo de formulário -> Transmissão')
      .toEqual(transmission);
    expect(component.formFilter.get('deadline').value)
      .withContext('Deve resetar campo de formulário -> Prazo')
      .toEqual(deadline);
    expect(component.formFilter.get('period').value)
      .withContext('Deve resetar campo de formulário -> Período')
      .toBe(period);
    expect(component.formFilter.get('periodFrom').value)
      .withContext('Deve resetar campo de formulário -> Data de')
      .toBe(periodFrom);
    expect(component.formFilter.get('periodTo').value)
      .withContext('Deve resetar campo de formulário -> Data até')
      .toBe(periodTo);
    expect(component.disableButtonApplyFilters)
      .withContext(
        'Deve Habilitar botão de Aplicar Filtros quando houver campos obrigatórios preenchidos'
      )
      .toBeFalse();
  });

  it(`#onChangeMultiSelect
    deve atualizar o array do disclaimer quando algum multiSelect tiver seu valor alterado`, fakeAsync(() => {
    const mockResponseBranchService: BranchResponse = {
      items: [
        { branchCode: 'D MG 01', branchDescription: ' BELO HOR' },
        { branchCode: 'D RJ 02', branchDescription: ' NITEROI' },
        { branchCode: 'M PR 02', branchDescription: ' CASCAVEL' },
      ],
      hasNext: false,
    };
    const mockResponseEventService: EventResponse = {
      items: [
        {
          eventCode: 'S-1000',
          permissionEvent: true,
          eventDescription:
            'INFORMACOES DO EMPREGADOR/CONTRIBUINTE/ÓRGÃO PÚBLICO',
        },
      ],
    };
    component.selectedFilters = [
      {
        label: 'D MG 01- BELO HOR',
        value: 'D MG 01',
      },
    ];
    const mockListBranch: Array<PoMultiselectOption> = [
      { label: 'D MG 01- BELO HOR', value: 'D MG 01' },
      { label: 'D RJ 02- NITEROI', value: 'D RJ 02' },
      { label: 'M PR 02- CASCAVEL', value: 'M PR 02' },
    ];
    spyOn(branchService, 'getListBranchs').and.returnValue(
      of(mockResponseBranchService)
    );
    spyOn(eventService, 'getListEvents').and.returnValue(
      of(mockResponseEventService)
    );
    component.onChangeMultiSelect('branch', mockListBranch);
    fixture.detectChanges();
    tick(5000);
    expect(component.listBranch)
      .withContext(
        'Deve atualizar o conteúdo do MultiSelect conforme a nova lista'
      )
      .toEqual(mockListBranch);
  }));

  it(`#applyFilter
    deve emitir percentuais da régua de progresso, valores da tabela de auditoria e sumário da série de gráficos corretamente quando solicitado`, fakeAsync(() => {
    const mockResponseExecutAudit: AuditExecuteResponse = {
      requestId: '3b987c10-4640-2f8c-162d-0890bab33b52',
    };
    const mockResponseStatusAudit: AuditStatusResponse = {
      finished: true,
      percent: 100,
    };
    const mockChartSeriesAudit: AuditChartSeriesResponse = {
      notTransmInDeadline: 1,
      notTransmOutDeadline: 0,
      transmInDeadline: 0,
      transmOutDeadline: 0,
    };
    const mockResponseValuesAudit: AuditValuesResponse = {
      items: [
        {
          branch: 'D MG 01',
          cpf: 'N/A',
          dateTrans: 'N/A',
          deadline: '15/01/22',
          deadlineDescription:
            'Até o dia 15 do mês subsequente ao mês de referência do evento.',
          eventDescription:
            'S-1202 - MENSAL - REMUNERACAO DE SERVIDOR VINCULADO AO REGIME PROPRIO DE PREVID. SOCIAL',
          indApur: 'FOLHA DE PAGAMENTO MENSAL',
          name: 'N/A',
          periodEvent: '12/2021',
          receipt: '1.123456789',
          registration: 'N/A',
          ruleDescription: 'Apuração Mensal',
          status: '3',
          transmissionObservation:
            'Neste evento foi utilizado a funcionalidade de ajuste de recibo, sua data de transmissão não foi informada e pode gerar divergencias.',
          typeOrigin: 'INCLUSÃO',
          establishment: '53113791000122',
          processNumber: '98504531120235002674',
        },
      ],
      hasNext: false,
    };

    spyOn(auditService, 'postExecuteAudit').and.returnValue(
      of(mockResponseExecutAudit)
    );
    spyOn(auditService, 'getStatusAudit').and.returnValue(
      of(mockResponseStatusAudit)
    );
    spyOn(auditService, 'getChartSeriesAudit').and.returnValue(
      of(mockChartSeriesAudit)
    );
    spyOn(auditService, 'getValuesAudit').and.returnValue(
      of(mockResponseValuesAudit)
    );
    spyOn(component.progressBar, 'emit');
    spyOn(component.payloadAuditChart, 'emit');
    spyOn(component.payloadAuditTable, 'emit');

    component.formFilter.get('branch').setValue(branch);
    component.formFilter.get('period').setValue(period);
    component.formFilter.get('event').setValue(event);
    component.formFilter.get('transmission').setValue(transmission);
    component.formFilter.get('deadline').setValue(deadline);
    component.formFilter.get('periodFrom').setValue(periodFrom);
    component.formFilter.get('periodTo').setValue(periodTo);

    component.applyFilter();
    tick(10000);
    expect(component.progressBar.emit)
      .withContext(
        'Deve emitir percentual de conclusão para régua de progresso'
      )
      .toHaveBeenCalled();
    expect(component.payloadAuditChart.emit)
      .withContext(
        'Deve emitir resposta da API com sumário de séries do gráfico'
      )
      .toHaveBeenCalledWith(mockChartSeriesAudit);
  }));

  it(`#onClean()
    deve resetar campos do formulario e controlar liberacao do botao de Aplicar Filtro quando o usuario excluir itens do disclaimer`, () => {
      component.onClean();
    
    expect(component.selectedFilters)
      .withContext('Deve resetar todos os campos do filtro')
      .toHaveSize(0);
  });
});
