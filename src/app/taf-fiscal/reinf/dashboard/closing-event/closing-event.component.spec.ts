import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PoButtonModule, PoI18nPipe, PoInfoModule, PoTagModule } from '@po-ui/ng-components';
import { ClosingEventComponent } from './closing-event.component';
import { EventErrorMessageModule } from 'shared/event-error-message/event-error-message.module';
import { ClosingEventService } from './closing-event.service';
import { CoreModule } from 'core/core.module';
import { ClosingEventResponse } from 'taf-fiscal/models/closing-event-response';
import { ClosingQueryingResponse } from '../../../../../app/models/closing-querying-response';
import { MessengerModule } from 'shared/messenger/messenger.module';

xdescribe('ClosingEventComponent', () => {
  let component: ClosingEventComponent;
  let fixture: ComponentFixture<ClosingEventComponent>;
  let injector: TestBed;
  let closingEventService: ClosingEventService;
  let originalTimeout: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClosingEventComponent],
      imports: [
        CoreModule,
        CommonModule,
        BrowserModule,
        PoButtonModule,
        PoInfoModule,
        PoTagModule,
        EventErrorMessageModule,
        RouterTestingModule,
        MessengerModule,
      ],
      providers: [PoI18nPipe, ClosingEventService],
    }).compileComponents();
    injector = getTestBed();
    closingEventService = injector.get(ClosingEventService);
  }));

  beforeEach(() => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01 ',
    };

    sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));

    fixture = TestBed.createComponent(ClosingEventComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 700000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve realizar a chamada da função onClosing com o closingEvent2099 false e statusButton2099 1', () => {
    const mockClosingEvent2099 = false;
    const mockStatusButton2099 = '1';

    component.closingEvent2099 = false;
    component.statusButton2099 = '1';

    component.onClosing();
    fixture.detectChanges();

    expect(component.closingEvent2099).toEqual(mockClosingEvent2099);
    expect(component.statusButton2099).toEqual(mockStatusButton2099);
  });

  it('deve realizar a chamada da função onClosing com o closingEvent2099 true e statusButton2099 2', () => {
    const mockClosingEvent2099 = true;
    const mockStatusButton2099 = '2';

    component.closingEvent2099 = true;
    component.statusButton2099 = '2';

    component.onClosing();
    fixture.detectChanges();

    expect(component.closingEvent2099).toEqual(mockClosingEvent2099);
    expect(component.statusButton2099).toEqual(mockStatusButton2099);
  });

  it('deve realizar a chamada da função onTransmitting com o evento R-2098', () => {
    const spyClosingPeriod = spyOn(component, 'closingPeriod');

    const mockEvent = 'R-2098';

    component.onTransmitting(mockEvent);
    fixture.detectChanges();

    expect(spyClosingPeriod).toHaveBeenCalledWith(mockEvent);
    expect(component.isLoading2099).toBeTruthy();
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098', () => {
    const event = 'R-2098';

    component.period = '201903';

    component.closingPeriod(event);
    fixture.detectChanges();

    expect(component.isLoading2099).toBeFalsy();
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098 e com retorno true do service', async function() {
    const event = 'R-2098';
    const mockClosingEventResponse: ClosingEventResponse = {
      success: 'true',
      message: 'Processamento realizado com sucesso',
    };

    const spy = spyOn(closingEventService, 'closingEvent').and.returnValue(
      of(mockClosingEventResponse)
    );

    component.period = '201903';

    await component.closingPeriod(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.statusButton2099).toEqual('5');
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2099 e com retorno true do service', async function() {
    const event = 'R-2099';
    const mockClosingEventResponse: ClosingEventResponse = {
      success: 'true',
      message: 'Processamento realizado com sucesso',
    };

    const spy = spyOn(closingEventService, 'closingEvent').and.returnValue(
      of(mockClosingEventResponse)
    );

    component.period = '201903';

    await component.closingPeriod(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.statusButton2099).toEqual('3');
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098 e com retorno false do service', async function() {
    const event = 'R-2098';
    const mockClosingEventResponse: ClosingEventResponse = {
      success: '',
      message: 'Processamento realizado com sucesso',
    };

    const spy = spyOn(closingEventService, 'closingEvent').and.returnValue(
      of(mockClosingEventResponse)
    );

    component.period = '201903';

    await component.closingPeriod(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098, com retorno false do service e com messagem de falha de conexão', async function() {
    const event = 'R-2098';
    const mockClosingEventResponse: ClosingEventResponse = {
      success: '',
      message: 'Não foi possivel conectar com o servidor TSS',
    };

    const spy = spyOn(closingEventService, 'closingEvent').and.returnValue(
      of(mockClosingEventResponse)
    );

    component.period = '201903';

    await component.closingPeriod(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função onQuerying com o evento R-2098', async function() {
    const event = 'R-2098';

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(component.isLoading2099).toBeTruthy();
  });

  it('deve realizar a chamada da função onQuerying com o evento R-2098 e com retorno true do service', async function() {
    const event = 'R-2098';
    const mockClosingQueryingResponse: ClosingQueryingResponse = {
      success: true,
      message: 'Processamento realizado com sucesso',
      protocol: '1234567890',
      errorid: '',
    };
    const spyonClosing = spyOn(component, 'onClosing');
    const spy = spyOn(
      closingEventService,
      'queryingClosedEvent'
    ).and.returnValue(of(mockClosingQueryingResponse));

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.isLoading2099).toBeFalsy();
    expect(component.protocol2099).toEqual('');
    expect(spyonClosing).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função onQuerying com o evento R-2099 e com retorno true do service', async function() {
    const event = 'R-2099';
    const mockClosingQueryingResponse: ClosingQueryingResponse = {
      success: true,
      message: 'Processamento realizado com sucesso',
      protocol: '1234567890',
      errorid: '',
    };

    const spy = spyOn(
      closingEventService,
      'queryingClosedEvent'
    ).and.returnValue(of(mockClosingQueryingResponse));

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.statusButton2099).toEqual('4');
    expect(component.protocol2099).toEqual('1234567890');
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2099 e com retorno false do service', async function() {
    const event = 'R-2099';
    const mockClosingQueryingResponse: ClosingQueryingResponse = {
      success: false,
      message: 'Processamento realizado com sucesso',
      protocol: '1234567890',
      errorid: '12345',
    };
    const spy = spyOn(
      closingEventService,
      'queryingClosedEvent'
    ).and.returnValue(of(mockClosingQueryingResponse));

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098, com retorno false do service e errorid preenchido', async function() {
    const event = 'R-2098';
    const mockClosingQueryingResponse: ClosingQueryingResponse = {
      success: false,
      message: 'Processamento realizado com sucesso',
      protocol: '1234567890',
      errorid: '12345',
    };

    const spy = spyOn(
      closingEventService,
      'queryingClosedEvent'
    ).and.returnValue(of(mockClosingQueryingResponse));

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função closingPeriod com o evento R-2098, com retorno false do service e errorid vazio', async function() {
    const event = 'R-2098';
    const mockClosingQueryingResponse: ClosingQueryingResponse = {
      success: false,
      message: 'Processamento realizado com sucesso',
      protocol: '1234567890',
      errorid: '',
    };

    const spy = spyOn(
      closingEventService,
      'queryingClosedEvent'
    ).and.returnValue(of(mockClosingQueryingResponse));

    component.period = '201903';

    await component.onQuerying(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar a chamada da função setStatusPeriod com o statusPeriod open', () => {
    component.setStatusPeriod('open', '', 'open', '');
    fixture.detectChanges();

    expect(component.statusButton2099).toEqual('1');
    expect(component.closingEvent2099).toBeFalsy();

    expect(component.statusButton4099).toEqual('1');
    expect(component.closingEvent4099).toBeFalsy();
  });

  it('deve realizar a chamada da função setStatusPeriod com o statusPeriod waitingClosing', () => {
    component.setStatusPeriod('waitingClosing', '', 'waitingClosing', '');
    fixture.detectChanges();

    expect(component.statusButton2099).toEqual('3');
    expect(component.closingEvent2099).toBeTruthy();

    expect(component.statusButton4099).toEqual('3');
    expect(component.closingEvent4099).toBeTruthy();
  });

  it('deve realizar a chamada da função setStatusPeriod com o statusPeriod closed', () => {
    component.setStatusPeriod('closed', '12345', 'closed', '54321');
    fixture.detectChanges();

    expect(component.statusButton2099).toEqual('4');
    expect(component.closingEvent2099).toBeTruthy();
    expect(component.protocol2099).toEqual('12345');

    expect(component.statusButton4099).toEqual('4');
    expect(component.closingEvent4099).toBeTruthy();
    expect(component.protocol4099).toEqual('54321');
  });

  it('deve realizar a chamada da função setStatusPeriod com o statusPeriod waitingReopening', () => {
    component.setStatusPeriod('waitingReopening', '12345', 'waitingReopening', '54321');
    fixture.detectChanges();

    expect(component.statusButton2099).toEqual('5');
    expect(component.closingEvent2099).toBeTruthy();
    expect(component.protocol2099).toEqual('12345');

    expect(component.statusButton4099).toEqual('5');
    expect(component.closingEvent4099).toBeTruthy();
    expect(component.protocol4099).toEqual('54321');
  });

  it('deve realizar a chamada da função setStatusPeriod com o statusPeriod aberto', () => {
    const spy = spyOn(component, 'setStatusPeriod');

    component.setStatusPeriod('aberto', '', 'aberto', '');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
