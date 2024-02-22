import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { of } from 'rxjs';
import { AuditEnvironmentService } from './audit-filter/services/audit-environment.service';
import { AuditService } from './audit-filter/services/audit.service';
import { Audit } from './social-audit-models/Audit';
import { AuditChartSeriesResponse } from './social-audit-models/AuditChartSeriesResponse';
import { AuditValuesResponse } from './social-audit-models/AuditValuesResponse';
import { SocialAuditComponent } from './social-audit.component';
import { SocialAuditModule } from './social-audit.module';

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

xdescribe(SocialAuditComponent.name, () => {
  let component: SocialAuditComponent = null;
  let fixture: ComponentFixture<SocialAuditComponent> = null;
  let auditService: AuditService = null;
  let auditEnvironmentService: AuditEnvironmentService;

  const TAFCompany = {
    company_code: 'T1',
    branch_code: 'D MG 01',
  };
  const tafFull = true;
  const tafContext = 'esocial';

  sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
  sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
  sessionStorage.setItem('TAFContext', tafContext);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SocialAuditModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialAuditComponent);
    component = fixture.componentInstance;
    auditService = TestBed.inject(AuditService);
    auditEnvironmentService = TestBed.inject(AuditEnvironmentService);
  });

  it(`deve criar o componente ${SocialAuditComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`#loadProgressBar
    deve incrementar régua de processamento e liberar controles após conclusão de término quando solicitado`, () => {
    const percent = [0, 25, 50, 100, 150];
    percent.forEach(percent => {
      component.loadProgressBar(percent);
    });

    expect(component.disabledInputs)
      .withContext(`disabledInputs: ${component.disabledInputs}`)
      .toBeFalse();
    expect(component.loadingTable)
      .withContext(`disabledInputs: ${component.loadingTable}`)
      .toBeFalse();
    expect(component.progressSuccess)
      .withContext(`disabledInputs: ${component.progressSuccess}`)
      .toBeTrue();
  });

  it(`#loadChartSeries
    deve calcular totais e labels das series de grafico corretamente quando solicitado`, async () => {
    const params = {
      companyId: auditEnvironmentService.getCompany(),
      requestId: '0830028c-4462-3824-bce1-5284b80122b2',
    };
    const responseAuditChart: AuditChartSeriesResponse = {
      notTransmInDeadline: 3,
      notTransmOutDeadline: 1,
      transmInDeadline: 2,
      transmOutDeadline: 1,
    };
    const mockChartTransmissionInfo: Array<Object> = [
      {
        label: 'Transmitido e Aceito pelo governo',
        data: 3,
        tooltip: 'Eventos Transmitidos e Aceitos pelo governo : 3',
        color: 'rgb(86, 185, 107)',
      },
      {
        label: 'Pendente de Transmissão ao Governo',
        data: 4,
        tooltip: 'Eventos Pendentes de Transmissão ao Governo : 4',
        color: 'rgb(198, 72, 64)',
      },
    ];
    const mockChartComplianceInfo: Array<Object> = [
      {
        label: 'Transmitidos | Dentro do Prazo',
        data: 2,
        tooltip: 'Transmitidos e Dentro do Prazo : 2',
        color: 'rgb(86, 185, 107)',
      },
      {
        label: 'Transmitidos | Fora do Prazo',
        data: 1,
        tooltip: 'Transmitidos mas Fora do Prazo : 1',
        color: 'rgb(198, 72, 64)',
      },
      {
        label: 'Não Transmitidos | Dentro do Prazo',
        data: 3,
        tooltip: 'Não Transmitidos mas Dentro do Prazo : 3',
        color: 'rgb(44, 133, 200)',
      },
      {
        label: 'Não Transmitidos | Fora do Prazo',
        data: 1,
        tooltip: 'Não Transmitidos e Fora do Prazo : 1',
        color: 'rgb(234, 155, 62)',
      },
    ];

    spyOn(auditService, 'getChartSeriesAudit').and.returnValue(
      of(responseAuditChart)
    );

    await auditService
      .getChartSeriesAudit(params)
      .toPromise()
      .then(response => {
        component.loadChartSeries(response);

        expect(mockChartComplianceInfo)
          .withContext(`Mock da Série Compliance do Gráfico`)
          .toEqual(component.chartComplianceInfo);
        expect(mockChartTransmissionInfo)
          .withContext(`Mock da Série Transmission do Gráfico`)
          .toEqual(component.chartTransmissionInfo);
      });
  });

  it(`#loadMainTable
    deve carregar/incrementar tabela principal, liberar controles de exibição e ocultar régua de processamento quando dados chegarem do serviço`, async () => {
    const params = {
      companyId: auditEnvironmentService.getCompany(),
      requestId: '0830028c-4462-3824-bce1-5284b80122b2',
      page: 1,
      pageSize: 20,
    };
    const mockItemsTable: Array<Audit> = [
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
    ];
    const responseReportTableEmpty: AuditValuesResponse = {
      items: [],
      hasNext: false,
    };
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

    spyOn(auditService, 'getValuesAudit').and.returnValue(
      of(responseReportTable)
    );
    component.loadMainTable(responseReportTableEmpty);
    expect(component.emptyResult)
      .withContext(`Deve sinalizar resultado vazio`)
      .toBeTrue();
    expect(component.verifyRegisters)
      .withContext(
        `Deve sinalizar para não liberar exibição de tabela nem gráficos`
      )
      .toBeFalse();

    await auditService
      .getValuesAudit(params)
      .toPromise()
      .then(response => {
        component.loadMainTable(response);
        expect(component.itemsTable)
          .withContext(`Mock de inclusão de itens na tabela`)
          .toEqual(mockItemsTable);
        expect(component.verifyRegisters)
          .withContext(
            `Deve sinalizar para liberar exibição de tabela em gráficos`
          )
          .toBeTrue();
        expect(component.progressBarValue)
          .withContext(`Deve ocultar régua de processamento`)
          .toBeUndefined();
      });
  });

  it(`#reset
    deve resetar elementos de controle do componente quando filtro emitir evento de reset`, () => {
    const auditFilterEl: HTMLElement = fixture.nativeElement.querySelector(
      'app-audit-filter'
    );
    const resetEvent = new CustomEvent('reset');
    auditFilterEl.dispatchEvent(resetEvent);

    expect(component.progressBarValue)
      .withContext(`Deve resetar valor da barra de progresso`)
      .toBeUndefined();
    expect(component.progressSuccess)
      .withContext(`Deve resetar flag de sucesso`)
      .toBeUndefined();
    expect(component.itemsTable)
      .withContext(`Deve resetar itens da tabela principal`)
      .toBeUndefined();
    expect(component.verifyRegisters)
      .withContext(
        `Deve sinalizar para não liberar exibição de tabela nem gráficos`
      )
      .toBeFalse();
    expect(component.emptyResult)
      .withContext(`Deve sinalizar resultado vazio`)
      .toBeFalse();
  });
});
