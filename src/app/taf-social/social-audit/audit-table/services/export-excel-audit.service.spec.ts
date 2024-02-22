import { TestBed } from '@angular/core/testing';
import { tafSocialPt } from './../../../../core/i18n/taf-social-pt';
import { of } from 'rxjs';
import { PoI18nPipe, PoI18nModule, PoI18nConfig } from '@po-ui/ng-components';
import { AuditValuesResponse } from './../../social-audit-models/AuditValuesResponse';
import { AuditEnvironmentService } from './../../audit-filter/services/audit-environment.service';
import { ExportExcelAuditService } from './export-excel-audit.service';

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

xdescribe(ExportExcelAuditService.name, () => {
  let environmentService: AuditEnvironmentService = null;
  let service: ExportExcelAuditService = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoI18nModule.config(i18nConfig)],
      providers: [AuditEnvironmentService, ExportExcelAuditService, PoI18nPipe],
    }).compileComponents();

    service = TestBed.inject(ExportExcelAuditService);
    environmentService = TestBed.inject(AuditEnvironmentService);
  });

  it(`deve ser criado serviço ${ExportExcelAuditService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#exportToFile
    deve exportar os dados de auditoria para planilha excel sem falhar quando solicitado`, done => {
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
    const mockRequestID: string = '063b5859-1fbf-cd43-5337-e96d4f16695';
    const params = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
    };

    spyOn(service, 'getValuesAudit').and.returnValue(
      of(mockResponseValuesAudit).toPromise()
    );

    expect(() => service.exportToFile(params).then(() => done())).not.toThrow();
  });
});
