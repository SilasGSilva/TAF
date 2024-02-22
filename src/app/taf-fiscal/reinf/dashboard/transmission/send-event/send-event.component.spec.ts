import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { SendEventComponent } from './send-event.component';
import {
  PoI18nConfig,
  PoI18nPipe,
  PoI18nModule,
} from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SendEventModule } from './send-event.module';
import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { corePt } from 'core/i18n/core-pt';

xdescribe('SendEventComponent', () => {
  let component: SendEventComponent;
  let fixture: ComponentFixture<SendEventComponent>;
  let injector: TestBed;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      core: {
        'pt-BR': corePt
      },
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SendEventModule,
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
        RouterTestingModule,
      ],

      providers: [LiteralService, PoI18nPipe],
    }).compileComponents();

    injector = getTestBed();
  }));

  beforeEach(() => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01 ',
    };

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));

    fixture = TestBed.createComponent(SendEventComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função disableButton', () => {
    component.disableButton();

    expect(component.disabled).toBeTruthy();
  });

  it('Deve executar a função showTitleModal', () => {
    const title = component.showTitleModal(2);

    expect(title).toEqual('cannotAccessTSS');
  });

  it('Deve executar a função enableButton', () => {
    component.enableButton();

    expect(component.disabled).toBeFalsy();
  });

  it('Deve executar a função setStatusMessage', () => {
    component.event = '';

    fixture.detectChanges();

    component.setStatusMessage('Teste', 'Corpo da mensagem');

    expect(component.statusMessageHeader).toEqual('Teste');
  });

  it('Deve executar a função showSuccessModal', () => {
    component.event = '';
    const spy = spyOn(component, 'showSuccessModal').and.callThrough();
    component.showSuccessModal();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-1000';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-1000';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-1070';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-1070';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2010';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2010';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2020';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2020';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2030';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2030';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2040';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2040';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2050';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2050';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 1 registro', () => {
    component.event = 'R-2060';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função showSuccessModal com 2 registros', () => {
    component.event = 'R-2060';
    component.events = [
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
      {
        branch: 'T1D MG 01',
        taxNumber: '045.313.763-66',
        company: 'T1',
        taxNumberFormated: 'string',
        totalInvoice: 1000,
        totalTaxBase: 800,
        totalGrossValue: 890,
        totalTaxes: 863,
        status: 'Pendente',
        key: 'string',
      },
    ];
    const spy = spyOn(component, 'showMessage').and.callThrough();
    component.showMessage();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Deve fazer a transmissão dos items', () => {
    component.period = '012020';
    component.event = 'R-1070';

    component.events = [
      {
        beginingDate: '062018',
        cityCode: '50308 - SAO PAULO',
        courtFederatedUnit: 'SAO PAULO',
        courtId: '003888',
        finishingDate: '      ',
        key: '10095957620188260001 ',
        proccesNumber: '10095957620188260001 ',
        proccesType: 'Judicial',
        status: 'notTransmitted',
        taxNumberFormated: '',
      },
    ];

    const spySend = spyOn(component, 'send').and.callThrough();

    component.send();
    expect(spySend).toHaveBeenCalledTimes(1);
  });
});
