import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { AuditChartModule } from './audit-chart.module';
import { AuditValuesResponse } from './../social-audit-models/AuditValuesResponse';
import { AuditService } from './../audit-filter/services/audit.service';
import { AuditChartComponent } from './audit-chart.component';

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

xdescribe(AuditChartComponent.name, () => {
  let fixture: ComponentFixture<AuditChartComponent> = null;
  let component: AuditChartComponent = null;
  let auditService: AuditService = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuditChartModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig)
      ],
      providers: [PoI18nPipe],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditChartComponent);
    component = fixture.componentInstance;
    auditService = TestBed.inject(AuditService);
  });

  it(`deve criar o componente ${AuditChartComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`#prepareModal
    deve preparar filtro e abrir modal de detalhamento conforme série escolhida pelo usuário quando solicitado`, () => {
      const responseAuditValues: AuditValuesResponse = {
        items: [
          {
            branch: "D MG 01",
            cpf: "737.565.170-12",
            dateTrans: "N/A",
            deadline: "15/01/22",
            deadlineDescription: "Até o dia 15 do mês subsequente ao mês de referência do evento.",
            eventDescription: "S-1200 - MENSAL - REMUNERAÇÃO DO TRABALHADOR VINCULADO AO REGIME GERAL DE PREVIDÊNCIA SOCIAL - RGPS",
            indApur: "FOLHA DE PAGAMENTO MENSAL",
            name: "JOSE CICERO DE ALMEIDA",
            periodEvent: "12/2021",
            receipt: "1.123456789",
            registration: "N/A",
            ruleDescription: "Apuração Mensal",
            status: "3",
            transmissionObservation: "Neste evento foi utilizado a funcionalidade de ajuste de recibo, sua data de transmissão não foi informada e pode gerar divergencias.",
            typeOrigin: "INCLUSÃO",
            establishment: "53113791000122",
            processNumber: '98504531120235002674',
          },
        ],
        hasNext: true
      };
      fixture.detectChanges();
      const seriesChosenByTheUser: Array<Object> = [
        { label: 'Transmitido e Aceito pelo governo' },
        { label: 'Pendente de Transmissão ao Governo' },
        { label: 'Transmitidos | Dentro do Prazo' },
        { label: 'Transmitidos | Fora do Prazo' },
        { label: 'Não Transmitidos | Dentro do Prazo' },
        { label: 'Não Transmitidos | Fora do Prazo' }
      ];

      spyOn(auditService, 'getValuesAudit')
        .and.returnValue(of(responseAuditValues));

      seriesChosenByTheUser.forEach(series => {
        component.prepareModal(series);
        const modalEl: HTMLElement = fixture.nativeElement
          .querySelector('po-modal');
        expect(modalEl)
          .withContext('Deve haver um modal')
          .not.toBeNull();
      })

      expect(component.chartSliceTableItems.length)
        .withContext('Deve existir informação na tabela')
        .toBe(1);

      component.showMoreRegisters(true);
      expect(component.chartSliceTableItems.length)
        .withContext('Deve incrementar informação na tabela')
        .toBe(2);
    });
});
