import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PoPageModule, PoI18nPipe, PoNotificationService } from '@po-ui/ng-components';

import { ReportsComponent } from './reports.component';
import { ExportReportModule } from './export-report/export-report.module';
import { ReportFilterModule } from 'shared/filter/report-filter/report-filter.module';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { Reports } from '../../models/reports';
import { EventDescriptionResponse } from '../../../models/event-description-response';
import { ValidationPendingTableComponent } from '../dashboard/validation/validation-pending-table/validation-pending-table.component';
import { ValidationPendingTableModule } from '../dashboard/validation/validation-pending-table/validation-pending-table.module';

xdescribe('caso de testes do componente ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let fixture2: ComponentFixture<ValidationPendingTableComponent>;
  let injector: TestBed;
  let originalTimeout: number;
  let eventDescriptionService: EventDescriptionService;
  let poNotificationService: PoNotificationService;
  let mockReportsFilter: Reports;
  let mockReportsFilterEvents: Reports;
  let dummyEventDescriptionResponse: EventDescriptionResponse;
  let dummyEventDescriptionResponseEvents: EventDescriptionResponse;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent
      ],
      imports: [
        CommonModule,
        PoPageModule,
        ExportReportModule,
        ReportFilterModule,
        ValidationPendingTableModule,
        RouterTestingModule
      ],
      providers: [
        PoI18nPipe,
        EventDescriptionService
      ]
    })
    .compileComponents();

    injector = getTestBed();
    eventDescriptionService = injector.get(EventDescriptionService);
    poNotificationService = injector.get(PoNotificationService);
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

    fixture = TestBed.createComponent(ReportsComponent);
    fixture2 = TestBed.createComponent(ValidationPendingTableComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    mockReportsFilter = {
      event: 'R-2010',
      period: '032019'
    };

    mockReportsFilterEvents = {
      event: 'events',
      period: '032019'
    };

    dummyEventDescriptionResponse = {
      description: 'Retenção Contribuição Previdenciária - Serviços Tomados'
    };

    dummyEventDescriptionResponseEvents = {
      description: ''
    };

    fixture.detectChanges();
  });

  xit('deve criar o componente report', () => {
    expect(component).toBeTruthy();
  });

  xit('deve retornar a descrição do evento informado pelo usuário, quando o mesmo for diferente de "events"', () => {

    spyOn(eventDescriptionService, 'getDescription').and.returnValue(of(dummyEventDescriptionResponse));

    component.getDescription(mockReportsFilter);
    fixture.detectChanges();
  });

  xit('deve retornar a descrição do evento informado pelo usuário, quando o mesmo for "events"', () => {

    spyOn(eventDescriptionService, 'getDescription').and.returnValue(of(dummyEventDescriptionResponseEvents));

    component.getDescription(mockReportsFilterEvents);
    fixture.detectChanges();
  });

  xit('deve retornar erro na consulta da descrição do evento informado', fakeAsync(() => {
    const error500 = throwError({
      body: '',
      status: '500'
    });

    const spyNotification = spyOn(poNotificationService, 'error');

    spyOn(eventDescriptionService, 'getDescription').and.returnValue(error500);

    component.getDescription(mockReportsFilterEvents);
    fixture.detectChanges();

    tick();

    expect(spyNotification).toHaveBeenCalled();
  }));

});
