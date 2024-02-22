import { ComponentFixture, TestBed, tick, fakeAsync, getTestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

import {
  PoI18nPipe,
  PoI18nModule,
  PoI18nConfig,
} from '@po-ui/ng-components';

import { DownloadService } from 'shared/download/download.service';
import { LiteralService } from 'core/i18n/literal.service';
import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { ExportReportModule } from './export-report.module';
import { ExportReportService } from './export-report.service';
import { ExportReportComponent } from './export-report.component';

xdescribe('ExportReportComponent', () => {
  let component: ExportReportComponent;
  let fixture: ComponentFixture<ExportReportComponent>;
  let injector: TestBed;
  let exportReportService: ExportReportService;

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
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
        ExportReportModule,
      ],

      providers: [
        LiteralService,
        PoI18nPipe,
        DatePipe,
        DownloadService,
        ExportReportService,
      ],
    }).compileComponents();

    injector = getTestBed();

    exportReportService = injector.inject(ExportReportService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.event = '';
    sessionStorage.removeItem('TAFFeatures');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função setDetailsItems com o evento R-2020', () => {
    component.event = 'R-2020';
    const mockItem = [
      {
        CPRB: '0 - Não é contribuinte da CPBR - Retenção 11%',
        additionalHoldValue: '0',
        totalTaxes: '100',
        additionalHoldValueNotConfirmed: '0',
        additionalUnpaidRetentionAmount: '0',
        aliquot: '11',
        branch: 'D MG 01 ',
        company: 'FORNECEFOR SP',
        constructionSiteDescription: '',
        documentType: 'NFS',
        employeeCode: 'F001   01',
        grossValue: '10.000',
        invoice: '16042020',
        invoiceSeries: '100',
        issueDate: '16042020',
        mainWithHoldingValue: '0',
        observation: 'OBSERVACAO',
        service: 'LIMPEZA, CONSERVACAO OU ZELADORIA',
        serviceCode: '100000001',
        serviceProvidingIndication:
          '0 - Não é obra de construção civil ou não está sujeita a matrícula de obra',
        serviceType: '000001',
        subcontractServiceValue: '0',
        tax: '1.100',
        taxBase: '10.000',
        taxDocumentCode: '000000000000079',
        taxNumber: '59.281.857/0001-70',
        taxNumberBranch: '27.231.185/0001-00',
        totalGrossValue: null,
        totalTaxBase: null,
        typeOfInscriptionEmployee: '1 - CNPJ',
        unpaiRetentionAmount: '0',
        valueServicesProvidedOnSpecialCondition15Years: '0',
        valueServicesProvidedOnSpecialCondition20Years: '0',
        valueServicesProvidedOnSpecialCondition25Years: '0',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2010', () => {
    component.event = 'R-2010';
    const mockItem = [
      {
        CPRB: '0 - Não é contribuinte da CPBR - Retenção 11%',
        additionalHoldValue: '0',
        totalTaxes: '100',
        additionalHoldValueNotConfirmed: '0',
        additionalUnpaidRetentionAmount: '0',
        aliquot: '11',
        branch: 'D MG 01 ',
        company: 'FORNECEFOR SP',
        constructionSiteDescription: '',
        documentType: 'NFS',
        employeeCode: 'F001   01',
        grossValue: '10.000',
        invoice: '16042020',
        invoiceSeries: '100',
        issueDate: '16042020',
        mainWithHoldingValue: '0',
        observation: 'OBSERVACAO',
        service: 'LIMPEZA, CONSERVACAO OU ZELADORIA',
        serviceCode: '100000001',
        serviceProvidingIndication:
          '0 - Não é obra de construção civil ou não está sujeita a matrícula de obra',
        serviceType: '000001',
        subcontractServiceValue: '0',
        tax: '1.100',
        taxBase: '10.000',
        taxDocumentCode: '000000000000079',
        taxNumber: '59.281.857/0001-70',
        taxNumberBranch: '27.231.185/0001-00',
        totalGrossValue: null,
        totalTaxBase: null,
        typeOfInscriptionEmployee: '1 - CNPJ',
        unpaiRetentionAmount: '0',
        valueServicesProvidedOnSpecialCondition15Years: '0',
        valueServicesProvidedOnSpecialCondition20Years: '0',
        valueServicesProvidedOnSpecialCondition25Years: '0',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2030', () => {
    component.event = 'R-2030';
    const mockItem = [
      {
        branch: 'D MG 01',
        taxNumberBranch: '24949232000159',
        name: 'CLIENTE SP',
        doctype: 'Fatura',
        numberdocument: '1009R20301',
        serie: 'JOT',
        keydocument: '',
        itemdoc: '',
        itemdescription: '',
        type: '1 - Patrocínio',
        issuedate: '20200115',
        grossvalue: '10',
        totaltax: '0',
        payvalue: '10',
        paytax: '0',
        proccess: 'NPR0000006',
        typeproccess: '1',
        descriptionproccess: 'PROCESSO 06',
        suspendedvalue: '45',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2040', () => {
    component.event = 'R-2040';
    const mockItem = [
      {
        branch: 'D MG 01',
        taxNumberBranch: '24949232000159',
        name: 'CLIENTE SP',
        doctype: 'Fatura',
        numberdocument: '1009R20301',
        serie: 'JOT',
        keydocument: '',
        itemdoc: '',
        itemdescription: '',
        type: '1 - Patrocínio',
        issuedate: '20200115',
        grossvalue: '10',
        totaltax: '0',
        payvalue: '10',
        paytax: '0',
        proccess: 'NPR0000006',
        typeproccess: '1',
        descriptionproccess: 'PROCESSO 06',
        suspendedvalue: '45',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2050', () => {
    component.event = 'R-2050';
    const mockItem = [
      {
        branchId: 'D MG 01 ',
        branch: 'Belo Horizonte',
        taxNumber: '07363764000190',
        keyInvoice: '0000000018',
        serie: '001',
        numberInvoice: '1009R20501',
        item: '0001',
        issueDate: '20180714',
        grossValue: '1000',
        commercialization:
          'Comercialização da Produção para Entidade do Programa de Aquisição de Alimentos - PAA',
        valueINSS: 'GilRat',
        valueGilRat: '100',
        valueSenar: '100',
        processNumber: '10095957620188260001',
        codeProcessINSS: '0001',
        valueINSSNRet: '10',
        codeProcessGilRat: '0002',
        valueGilRatNRet: '15',
        codeProcessSenar: '0003',
        valueSenarNRet: '20',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2050 passando alguns valores em branco', () => {
    component.event = 'R-2050';
    const mockItem = [
      {
        branchId: 'D MG 01 ',
        branch: 'Belo Horizonte',
        taxNumber: '07363764000190',
        keyInvoice: '0000000018',
        serie: '001',
        numberInvoice: '1009R20501',
        item: '0001',
        issueDate: '20180714',
        grossValue: '1000',
        commercialization:
          'Comercialização da Produção para Entidade do Programa de Aquisição de Alimentos - PAA',
        valueINSS: '',
        valueGilRat: '',
        valueSenar: '',
        processNumber: '10095957620188260001',
        codeProcessINSS: '0001',
        valueINSSNRet: '10',
        codeProcessGilRat: '0002',
        valueGilRatNRet: '15',
        codeProcessSenar: '0003',
        valueSenarNRet: '20',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-2060', () => {
    component.event = 'R-2060';
    const mockItem = [
      {
        branchId: 'D MG 01 ',
        branch: 'Belo Horizonte',
        taxNumberBranch: '07363764000190',
        totalTaxBase: '10960',
        sociaSecurityContributionValue: '220',
        reviewDescription: '01 - AJUSTE 1',
        additionalValueOfAdjustment: '40',
        suspensionCode: '',
        socialSecurityContributionValueSuspended: '0',
        typeOfInscription: '1 - CNPJ',
        reviewType: '0',
        proccesNumber: '',
        exclusionValueOfAdjustment: '80',
        activityCode:
          '00000095 - EMPRESAS DO SETOR DE CONSTRUCAO CIVIL, ENQUADRADAS NO GRUPO 412 DA CNAE 2.0 - OBRAS COM MATRICULA CEI ATE 30/11/2015',
        totalGrossValue: '11000',
        proccesType: '',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função setDetailsItems com o evento R-3010', () => {
    component.event = 'R-3010';
    const mockItem = [
      {
        branch: 'D MG 01',
        nameVisitor: 'NOME VISITANTE',
        visitors: '15775622000169',
        totalGross: '11200',
        square: 'PRACA DESPORTIVA',
        category: 'Internacional',
        homeTeam: '55141505000168',
        payers: 1200,
        totalOfTaxes: '0',
        typeOfCompetition: 'Oficial',
        nameOfCompetition: 'NOME COMPETICAO',
        totalWithoutTaxes: '11000',
        numberId: '1504',
        contributionValue: '1232',
        notPayers: 10,
        modality: 'MODALIDADE',
        country: 'SAO PAULO',
        city: 'BARUERI',
      },
    ];

    const spy = spyOn(component, 'setDetailsItems').and.callThrough();

    component.setDetailsItems(mockItem);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getReportItems com access true', async () => {
    sessionStorage.setItem(
      'TAFFeatures',
      '{"downloadXLS": { "access": true, "message": "VGVzdGU=" }}'
    );
    component.period = '072020';
    component.event = 'R-2020';
    const spyGetReport = spyOn(
      exportReportService,
      'getReport'
    ).and.returnValue(of());

    await component.getReportItems();

    expect(spyGetReport).toHaveBeenCalled();
  });

  it('Deve executar a função getReportItems com access false', async () => {
    sessionStorage.setItem(
      'TAFFeatures',
      '{"downloadXLS": { "access": false, "message": "VGVzdGU=" }}'
    );
    component.period = '072020';
    component.event = 'R-2020';

    const spyGetReport = spyOn(component, 'getReportItems').and.callThrough();

    await component.getReportItems();
    expect(spyGetReport).toHaveBeenCalledTimes(1);
  });
});
