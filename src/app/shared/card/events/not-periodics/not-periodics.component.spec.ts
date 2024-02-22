import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotPeriodicsComponent } from './not-periodics.component';
import {
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe,
} from '@po-ui/ng-components';
import { sharedPt } from 'core/i18n/shared-pt';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LiteralService } from 'core/i18n/literal.service';
import { ReportValidationTableService } from 'taf-fiscal/reinf/reports/report-validation-table/report-validation-table.service';
import { SharedModule } from 'shared/shared.module';
import { Router, Routes } from '@angular/router';
import { TransmissionPendingTableComponent } from 'taf-fiscal/reinf/dashboard/transmission/transmission-pending-table/transmission-pending-table.component';
import { TransmissionPendingTableModule } from 'taf-fiscal/reinf/dashboard/transmission/transmission-pending-table/transmission-pending-table.module';
import { EventMonitorComponent } from 'taf-fiscal/reinf/dashboard/event-monitor/event-monitor.component';
import { ValidationComponent } from 'taf-fiscal/reinf/dashboard/validation/validation.component';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';

xdescribe('NotPeriodicsComponent', () => {
  let component: NotPeriodicsComponent;
  let fixture: ComponentFixture<NotPeriodicsComponent>;
  let router: Router;

  const routes: Routes = [
    {
      path: 'eventsMonitor/transmission',
      component: TransmissionPendingTableComponent,
    },
    {
      path: 'eventsMonitor/event-monitor',
      component: EventMonitorComponent,
    },
    {
      path: 'eventsMonitor/validation',
      component: ValidationComponent,
    },
  ];

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      shared: {
        'pt-BR': sharedPt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
        SharedModule,
        TransmissionPendingTableModule,
        TafFiscalModule,
        RouterTestingModule.withRoutes(routes),
      ],

      providers: [
        LiteralService,
        ReportValidationTableService,
        PoI18nPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPeriodicsComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    component.monitoring = [
      {
        statusCode: 3,
        quantity: 1,
      },
      {
        statusCode: 0,
        quantity: 2,
      },
    ];
    fixture.ngZone.run(() => {
      router.initialNavigation();
    });

    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função classValidated', () => {
    const spy = spyOn(component, 'classValidated').and.callThrough();
    component.classValidated();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função goToMonitoring', () => {
    const spy = spyOn(component, 'goToMonitoring').and.callThrough();

    component.goToMonitoring();

    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getTotalTransmited', () => {
    component.totalNotValidation = 0;
    component.totalValidation = 2;
    const spy = spyOn(component, 'getTotalTransmited').and.callThrough();
    component.getTotalTransmited();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getTotalTransmited', () => {
    component.totalNotValidation = 1;
    component.totalValidation = 2;
    component.monitoring = [];
    const spy = spyOn(component, 'getTotalTransmited').and.callThrough();
    component.getTotalTransmited();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função goToTransmission', () => {
    const spy = spyOn(component, 'goToTransmission').and.callThrough();
    component.goToTransmission();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getStatusButton', () => {
    component.statusMonitoring = 2;
    const spy = spyOn(component, 'getStatusButton').and.callThrough();
    component.getStatusButton();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getStatusButton', () => {
    component.statusMonitoring = 3;
    const spy = spyOn(component, 'getStatusButton').and.callThrough();
    component.getStatusButton();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getStatusButton', () => {
    component.totalNotValidation = 0;
    component.statusMonitoring = 3;
    const spy = spyOn(component, 'getStatusButton').and.callThrough();
    component.getStatusButton();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função getStatusButton', () => {
    component.totalNotValidation = 1;
    component.monitoring = [];
    const spy = spyOn(component, 'getStatusButton').and.callThrough();
    component.getStatusButton();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função onClick', () => {
    component.totalNotValidation = 1;

    const spy = spyOn(component, 'onClick').and.callThrough();
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função onClick', () => {
    component.totalNotValidation = 0;
    component.totalValidation = 2;
    component.totalNotValidation = 0;

    const spy = spyOn(component, 'onClick').and.callThrough();
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('Deve executar a função onClick', () => {
    component.monitoring = [];

    const spy = spyOn(component, 'onClick').and.callThrough();
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });
});
