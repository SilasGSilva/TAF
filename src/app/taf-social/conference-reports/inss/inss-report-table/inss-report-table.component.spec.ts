import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import ptBr from '@angular/common/locales/pt';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { of } from 'rxjs';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ESocialBaseConferInssValuesResponse } from '../../conference-reports-models/ESocialBaseConferInssValuesResponse';
import { InssReportTableModule } from './inss-report-table.module';
import { InssReportTableService } from './services/inss-report-table.service';
import { InssReportTableComponent } from './inss-report-table.component';

registerLocaleData(ptBr)

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

xdescribe(InssReportTableComponent.name, () => {
  let component: InssReportTableComponent;
  let fixture: ComponentFixture<InssReportTableComponent>;
  let inssReportTableService: InssReportTableService;
  let messengerModalMock;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        InssReportTableModule,
        PoI18nModule.config(i18nConfig),
        HttpClientTestingModule
      ],
      providers: [
        PoI18nPipe,
        UntypedFormBuilder,
        CurrencyPipe,
        MasksPipe
      ],
      declarations: [ InssReportTableComponent ]
    })
    .compileComponents();

    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    fixture = TestBed.createComponent(InssReportTableComponent);
    inssReportTableService = TestBed.inject(InssReportTableService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.totalExpanded = 3;
    component.requestId = 'b83218c4-3dfa-0b0f-c6c0-ed534a7f9c10';
    component.isLoadingButton = false;
    component.loadingTable = false;

    messengerModalMock = {
      onShowMessage: jasmine.createSpy('onShowMessage'),
    };
    component.messengerModal = messengerModalMock;
  }));

  it(`deve criar o componente ${InssReportTableComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it('deve definir is LoadingButton e loadingTable', async () => {
    await component.exportReport(true);
    expect(component.isLoadingButton).toBe(false);
    expect(component.loadingTable).toBe(false);
  });

  it('deve diminuir o totalExpanded', () => {
    component.onCollapseDetail();
    expect(component.totalExpanded).toBe(2);
  });

  it('não deve permitir que totalExpanded seja negativo', () => {
    component.totalExpanded = 0;
    component.onCollapseDetail();
    expect(component.totalExpanded).toBe(0);

    component.totalExpanded = 1;
    component.onCollapseDetail();
    expect(component.totalExpanded).toBe(0);
  });

  it('#onExpandDetail', () => {
    component.totalExpanded = 1;
    component.onExpandDetail();
    expect(component.totalExpanded).toBe(2);
  })

  it(`#prepareModal
    deve abrir modal com informações analíticas quando solicitado`, () => {
      const mockESocialBaseConferInssValuesResponse: ESocialBaseConferInssValuesResponse = {
        items: [
          {
            cpfNumber: '33783985072',
            name: 'BICHAO DA GOIABA',
            branchId: '53113791001013',
            lotationCode: 'BOLACHA',
            esocialCategory: '101 - EMPREGADO – GERAL INCLUSIVE O EMPREGADO PÚBLICO DA ADMINISTRAÇÃO DIRETA OU INDIRETA CONTRATADO PELA CLT.',
            esocialRegistration: 'MATBICHAO001',
            inssValue: 0,
            inssTafValue: 0,
            inss13Value: 0,
            inss13TafValue: 0,
            inssBasis: 0,
            inssTafBasis: 0,
            familySalaryValue: 0,
            familySalaryTafValue: 0,
            maternitySalaryValue: 0,
            maternitySalaryTafValue: 0,
            inss13Basis: 0,
            inss13TafBasis: 0,
            maternitySalary13Value: 0,
            maternitySalary13TafRetValue: 0,
            inssRetValue: 155,
            inss13RetValue: 0,
            inssRetBasis: 175,
            inssRetSuspJudBasis: 0,
            inssRetTotalBasis: 175,
            familySalaryRetValue: 0,
            maternitySalaryRetValue: 0,
            inss13RetBasis: 0,
            maternitySalary13RetValue: 0,
            inssRetGrossValue: 13.12,
            inss13RetGrossValue: 0,
            inconsistent: true
          }
        ],
        hasNext: false
      };

      spyOn(inssReportTableService, 'getReportModal').and.returnValue(
        of(mockESocialBaseConferInssValuesResponse)
      );
      spyOn(component.poModalInss, 'open');

      component.prepareModal(mockESocialBaseConferInssValuesResponse.items[0]);

      expect(component.poModalInss.open)
        .withContext('Deve ser emitido evento de abertura do modal com informações analíticas')
        .toHaveBeenCalled();
  });
});
