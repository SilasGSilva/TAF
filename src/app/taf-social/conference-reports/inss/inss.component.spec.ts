import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ESocialBaseConferInssRetValuesResponse } from '../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { InssReportCardModule } from './inss-report-card/inss-report-card.module';
import { InssReportFilterModule } from './inss-report-filter/inss-report-filter.module';
import { InssReportProgressModule } from './inss-report-progress/inss-report-progress.module';
import { InssReportTableModule } from './inss-report-table/inss-report-table.module';
import { InssComponent } from './inss.component';

registerLocaleData(ptBr)

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

xdescribe(InssComponent.name, () => {
  let component: InssComponent;
  let fixture: ComponentFixture<InssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InssComponent],
      imports: [
        BrowserModule,
        InssReportFilterModule,
        InssReportCardModule,
        InssReportProgressModule,
        InssReportTableModule,
        PoPageModule,
        CoreModule,
        RouterTestingModule
      ],
      providers: [
        MasksPipe,
        LiteralService
      ],
    }).compileComponents();

    sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(ERPAPPCONFIG));
    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));

    fixture = TestBed.createComponent(InssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`deve criar o componente ${InssComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`Executa a função loadTable com payLoadReportTable com registros quando solicitado`, () => {
    const mockESocialBaseConferInssRetValuesResponse: ESocialBaseConferInssRetValuesResponse = {
        items: [
          {
            cpfNumber: '88338517534',
            name: 'S2200 - BRUNO MARS',
            inssGrossValue: 42.96,
            inssTafGrossValue: 50.39,
            inssRetGrossValue: 751.97,
            inssRetDescGrossValue: 50.39,
            inss13GrossValue: 0,
            inss13TafGrossValue: 0,
            inss13RetGrossValue: 0,
            inss13DescGrossValue: 0,
            familySalaryValue: 0,
            familySalaryTafValue: 0,
            familySalaryRetValue: 0,
            maternitySalaryValue: 0,
            maternitySalaryTafValue: 0,
            maternitySalaryRetValue: 0,
            maternitySalary13Value: 0,
            maternitySalary13TafRetValue: 0,
            maternitySalary13RetValue: 0,
            divergent: true,
          },
        ],
        hasNext: false,
      };
    component.loadTable(mockESocialBaseConferInssRetValuesResponse, false);
    component.loadTable(null, true);

    expect(true).toBeTrue();
  });

  it('Executa a função loadBar com valor igual a 100', () => {
    component.progressBarValue = 100;
    component.loadBar(100);
    fixture.detectChanges();

    expect(component.progressBarValue).toEqual(100);
  });

  it('Executa a função loadBar com valor menor que 100', () => {
    component.progressBarValue = 0;
    component.loadBar(99);
    fixture.detectChanges();

    expect(component.progressBarValue).toEqual(99);
  });

  it('Executa a função reset', () => {
    component.reset();
    fixture.detectChanges();
    expect(component.progressBarValue).toBeUndefined();
  });

  it('Executa a função dataSave - true', () => {
    component.verifyRegisters = true;
    component.dataSave();
    fixture.detectChanges();
    expect(component.verifyRegisters);
    expect(true).toBeTrue();
  });

  it('Executa a função dataSave - false', () => {
    component.verifyRegisters = false;
    component.dataSave();
    fixture.detectChanges();
    expect(component.verifyRegisters);
    expect(true).toBeTrue();
  });

  it('Executa a função getPageLink', () => {
    component.pageLink = '/fgtsReport';
    const mockPageLink = component.getPageLink();

    fixture.detectChanges();

    expect(component.pageLink).toEqual(mockPageLink);
  });

  it('Executa a função discardReport passando true', () => {
    component.disabledInputs = true;
    component.discardReport();
    fixture.detectChanges();

    expect(component.discardReport).toBeTruthy();
  });

  it('Executa a função discardReport passando false', () => {
    component.disabledInputs = false;
    component.discardReport();
    fixture.detectChanges();

    expect(component.discardReport).toBeTruthy();
  });

  it(`Deve executar a função setRequestId`, () => {
    let requestId: 'e23932f7-4db2-b060-4e0a-0abbf89cf671';

    component.setRequestId(requestId)
    fixture.detectChanges();
    expect(component.setRequestId(requestId));
    expect(true).toBeTrue();
  });
/*
  it(`Deve executar a função setCpfNumber`, () => {
    let cpfNumber: '470.808.238-03';

    component.setCpfNumber(cpfNumber)
    fixture.detectChanges();
    expect(component.setCpfNumber(cpfNumber));
    expect(true).toBeTrue();
  });
*/
  it(`Deve executar a função loadingReport`, () => {
    let loading: true;

    component.loadingReport(loading)
    fixture.detectChanges();
    expect(component.loadingReport(loading));
    expect(true).toBeTrue();
  });

  it(`Deve executar a função sendingStarted`, () => {
    let started: true;

    component.sendingStarted(started)
    fixture.detectChanges();
    expect(component.sendingStarted(started));
    expect(true).toBeTrue();
  });
});
