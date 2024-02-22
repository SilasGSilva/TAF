import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReportValidationTableDetailComponent } from './report-validation-table-detail.component';
import {
  PoI18nModule,
  PoI18nConfig,
} from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { TableDetailsService } from 'shared/table/table-details/table-details.service';
import { ReportValidationTableDetailModule } from './report-validation-table-detail.module';
import { tafFiscalPt } from '../../../../core/i18n/taf-fiscal-pt';

xdescribe('ReportValidationTableDetailComponent', () => {
  let component: ReportValidationTableDetailComponent;
  let fixture: ComponentFixture<ReportValidationTableDetailComponent>;
  let injector: TestBed;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReportValidationTableDetailModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
      ],
      providers: [LiteralService, TableDetailsService],
    }).compileComponents();

    injector = getTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportValidationTableDetailComponent);
    component = fixture.componentInstance;
    component.event = 'R-1070';
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve executar a função reportDetails usando o evento R-1070', () => {
    component.event = 'R-1070';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
  });

  it('deve executar a função reportDetails usando o evento R-2010', () => {
    component.event = 'R-2010';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
  });

  it('deve executar a função reportDetails usando o evento R-2020', () => {
    component.event = 'R-2020';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
  });

  it('deve executar a função reportDetails usando o evento R-2030', () => {
    component.event = 'R-2030';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('deve executar a função reportDetails usando o evento R-2040', () => {
    component.event = 'R-2040';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('deve executar a função reportDetails usando o evento R-2050', () => {
    component.event = 'R-2050';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
  });

  it('deve executar a função reportDetails usando o evento R-2060', () => {
    component.event = 'R-2060';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('deve executar a função reportDetails usando o evento R-3010', () => {
    component.event = 'R-3010';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('deve executar a função reportDetails usando um evento inválido', () => {
    component.event = '';
    const columns = component.reportDetails(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
  });

  it('deve executar a função setDetailsItems', () => {
    const mockRequest = [
      {
        suspensionIndicator: 'string',
        depositIndicator: 1000,
        suspensionCode: 1000,
        decisionDate: '12345678',
      },
    ];
    component.setDetailsItems(mockRequest);
    fixture.detectChanges();

    expect(component.tableDetailsItems.length).toEqual(1);
  });

  it('deve executar a função setDetailsItems usando sourceTaxNumber', () => {
    const mockRequest = [
      {
        sourceTaxNumber: '12345678',
        totalTaxes: '1000',
        branchId: 'T1|D MG 01',
        totalTaxBase: '1000',
        totalTransferAmount: '1000',
        totalInvoice: '1000',
        totalGrossValue: '1000',
        company: 'D MG 01',
        invoiceKey: '12345678',
      },
    ];
    component.setDetailsItems(mockRequest);
    fixture.detectChanges();

    expect(component.tableDetailsItems.length).toEqual(1);
  });
});
