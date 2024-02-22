import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import {
  PoI18nModule,
  PoI18nConfig,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { ReportValidationTableComponent } from './report-validation-table.component';
import { ReportValidationTableModule } from './report-validation-table.module';
import { ReportValidationTableService } from './report-validation-table.service';
import { PayloadEventsReinf } from '../../../../models/payload-events-reinf';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { tafFiscalPt } from '../../../../core/i18n/taf-fiscal-pt';

xdescribe('ReportValidationTableComponent', () => {
  let component: ReportValidationTableComponent;
  let fixture: ComponentFixture<ReportValidationTableComponent>;
  let injector: TestBed;
  let literalService: LiteralService;
  let reportValidationTableService: ReportValidationTableService;

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
        ReportValidationTableModule,
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
      ],
      providers: [
        LiteralService,
        ReportValidationTableService,
        PoI18nPipe,
      ],
    }).compileComponents();
    injector = getTestBed();

    literalService = injector.get(LiteralService);
    reportValidationTableService = injector.get(ReportValidationTableService);
  }));

  beforeEach(() => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      productLine: 'Protheus',
      tafVersion: 'vTAFA552-1.0.26'
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
    /*
    const statusEnvironment = {
      statusEnvironment: 'production',
      layoutReinf: '1_05_10',
      entidadeTSS: '000001'
    };;
    sessionStorage.setItem('statusEnvironment', JSON.stringify(statusEnvironment));*/

    fixture = TestBed.createComponent(ReportValidationTableComponent);
    component = fixture.componentInstance;
    component.event = '';
    fixture.detectChanges();
  });

  it('Deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função report usando o evento R-1000', () => {
    component.event = 'R-1000';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
  });

  it('Deve executar a função report usando o evento R-1070', () => {
    component.event = 'R-1070';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('Deve executar a função report usando o evento R-2010', () => {
    component.event = 'R-2010';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('Deve executar a função report usando o evento R-2020', () => {
    component.event = 'R-2020';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
  });

  it('Deve executar a função report usando o evento R-2030', () => {
    component.event = 'R-2030';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
  });

  it('Deve executar a função report usando o evento R-2040', () => {
    component.event = 'R-2040';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
  });

  it('Deve executar a função report usando o evento R-2050', () => {
    component.event = 'R-2050';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(3);
  });

  it('Deve executar a função report usando o evento R-2060', () => {
    component.event = 'R-2060';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
  });

  it('Deve executar a função report usando o evento R-3010', () => {
    component.event = 'R-3010';
    const columns = component.report(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
  });

  it('Deve executar a função report com um valor vazio', () => {
    const columns = component.report('');

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
  });

  it('Deve retornar se o evento é R-1000 ou não, retornando true.', () => {
    component.event = 'R-1000';
    const spy = spyOn(component, 'showDetails').and.returnValue(true);

    component.showDetails();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve retornar se o evento é R-1000 ou não, retornando false.', () => {
    component.event = 'R-2010';
    const spy = spyOn(component, 'showDetails').and.returnValue(false);

    component.showDetails();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve realizar a chamada da função setTableItem usando R-1000', () => {
    const spy = spyOn(component, 'setTableItem').and.callThrough();
    component.event = 'R-1000';
    const mockEventDetail = [
      {
        branch: 'Grupo TOTVS 1',
        contact: 'teste',
        contactTaxNumber: '31917109814',
        contactTaxNumberFormated: '319.171.098-14',
        finishingdate: '      ',
        hasFineExemptionAgreement: '0 - Sem acordo',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        isPayrollExemption: '0 - Não Aplicável',
        key: '27231185',
        status: 'notValidated',
        taxClassification: '000019',
        taxNumber: '27231185',
        taxNumberFormated: '27.231.185',
        typeOfInscription: '1 - CNPJ',
      },
    ];

    component.setTableItem(mockEventDetail,false);

    expect(spy).toHaveBeenCalled();
    expect(component.loadingOverlay).toBeFalsy();
  });

  it('Deve realizar a chamada da função setTableItem usando R-2030', () => {
    const spy = spyOn(component, 'setTableItem').and.callThrough();
    component.event = 'R-2030';
    const mockEventDetail = [
      {
        branchId: 'T1D MG 01',
        branch: 'Filial BELO HOR                         ',
        branchTaxNumber: '64722662000158',
        status: 'Validated',
        taxNumberFormated: '64.722.662/0001-58',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 2000,
        totalTaxes: 110,
        totalTaxBase: 10000,
        totalTransferAmount: 1000,
        key: 'ebac00d2-8167-e37f-230a-178cce86e21a',
      },
    ];

    component.setTableItem(mockEventDetail,false);

    expect(spy).toHaveBeenCalled();
    expect(component.loadingOverlay).toBeFalsy();
  });

  it('Deve realizar a chamada da função setTableItem usando R-2040', () => {
    const spy = spyOn(component, 'setTableItem').and.callThrough();
    component.event = 'R-2040';
    const mockEventDetail = [
      {
        branchId: 'T1D MG 01',
        branch: 'Filial BELO HOR                         ',
        branchTaxNumber: '64722662000158',
        status: 'Validated',
        taxNumberFormated: '64.722.662/0001-58',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 2000,
        totalTaxes: 110,
        totalTaxBase: 10000,
        totalTransferAmount: 1000,
        key: 'ebac00d2-8167-e37f-230a-178cce86e21a',
      },
    ];

    component.setTableItem(mockEventDetail,false);

    expect(spy).toHaveBeenCalled();
    expect(component.loadingOverlay).toBeFalsy();
  });

  it('Deve realizar a chamada da função setTableItem usando evento diferente de R-1000', () => {
    const spy = spyOn(component, 'setTableItem').and.callThrough();
    component.event = 'R-2010';
    const mockEventDetail = [
      {
        branch: 'Grupo TOTVS 1',
        contact: 'teste',
        contactTaxNumber: '31917109814',
        contactTaxNumberFormated: '319.171.098-14',
        finishingdate: '      ',
        hasFineExemptionAgreement: '0 - Sem acordo',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        isPayrollExemption: '0 - Não Aplicável',
        key: '27231185',
        taxClassification: '000019',
        taxNumber: '27231185',
        taxNumberFormated: '27.231.185',
        typeOfInscription: '1 - CNPJ',
      },
    ];

    component.setTableItem(mockEventDetail,false);

    expect(spy).toHaveBeenCalled();
    expect(component.loadingOverlay).toBeFalsy();
  });

  it('Deve realizar a chamada da função setTableItem usando evento diferente de R-1000', () => {
    const companyId: string = 'T1|D MG 01 ';
    component.period = '062020';
    component.event = 'R-1000';
    const fakeResponse = {
      eventDetail: [
        {
          taxNumber: '27231185',
          status: 'validated',
          hasFineExemptionAgreement: '0 - Sem acordo',
          beginingDate: '012019',
          finishingdate: '      ',
          contact: 'JAIR DA SILVA TEIXEIRA',
          key: '27231185',
          isPayrollExemption: '0 - Não Aplicável',
          contactTaxNumber: '27015444836',
          isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
          branch: 'Grupo TOTVS 1',
          typeOfInscription: '1 - CNPJ',
          taxClassification: '000001',
        }
      ],
      hasNext: false
    };
    const fakePayload: PayloadEventsReinf = {
      companyId: companyId,
      period: component.period,
      event: component.event,
    };

    const spyReload = spyOn(component, 'getInfoTableValidationPending');

    spyOn(reportValidationTableService, 'getInfoValidationPending')
      .withArgs(fakePayload)
      .and.returnValue(of(fakeResponse));

    component.getInfoTableValidationPending();
    expect(spyReload).toHaveBeenCalled();
  });
});
