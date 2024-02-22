import { CommonModule, registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  PoButtonModule,
  PoContainerModule,
  PoLoadingModule,
  PoModalModule,
  PoTableModule,
  PoDropdownModule,
  PoTooltipModule,
  PoPageModule,
  PoTagModule,
} from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { ButtonBackModule } from 'shared/button-back/button-back.module';
import { SharedModule } from 'shared/shared.module';
import { DashboardComponent } from './reinf/dashboard/dashboard.component';
import { SendEventModule } from './reinf/dashboard/transmission/send-event/send-event.module';
import { TransmissionPendingTableDetailSecondLevelModule } from './reinf/dashboard/transmission/transmission-pending-table-detail-second-level/transmission-pending-table-detail-second-level.module';
import { TransmissionPendingTableDetailModule } from './reinf/dashboard/transmission/transmission-pending-table-detail/transmission-pending-table-detail.module';
import { TransmissionPendingTableModule } from './reinf/dashboard/transmission/transmission-pending-table/transmission-pending-table.module';
import { TransmissionComponent } from './reinf/dashboard/transmission/transmission.component';
import { SendValidationModule } from './reinf/dashboard/validation/send-validation/send-validation.module';
import { ClosingEventModule } from './reinf/dashboard/closing-event/closing-event.module';
import { ReportsModule } from './reinf/reports/reports.module';
import { ExportReportModule } from './reinf/reports/export-report/export-report.module';
import { ValidationPendingTableModule } from './reinf/dashboard/validation/validation-pending-table/validation-pending-table.module';
import { ValidationPendingTableDetailModule } from './reinf/dashboard/validation/validation-pending-table-detail/validation-pending-table-detail.module';
import { ValidationPendingTableDetailSecondLevelModule } from './reinf/dashboard/validation/validation-pending-table-detail-second-level/validation-pending-table-detail-second-level.module';
import { ValidationComponent } from './reinf/dashboard/validation/validation.component';
import { TafFiscalComponent } from './taf-fiscal.component';
import { TafFiscalRountingModule } from './taf-fiscal.routing.module';
import { TsiMonitorModule } from './tsi/monitor/tsi-monitor.module';
import { EventStatusCardListModule } from './../shared/card/events/event-status-card-list/event-status-card-list.module';
import { EventMonitorTableModule } from './reinf/dashboard/event-monitor/event-monitor-table/event-monitor-table.module';
import { DeleteEventDialogModule } from './../shared/delete-event-dialog/delete-event-dialog-module';
import { StatusEnvironmentReinfComponent } from './reinf/dashboard/status-environment-reinf/status-environment-reinf.component';
import { EventMonitorComponent } from './reinf/dashboard/event-monitor/event-monitor.component';
import { DivergentDocumentsModule } from './tsi/divergent-documents/tsi-divergent-documents.module';
import { SmartViewMonitorModule } from './smart-view/monitor/sv-monitor.module';

registerLocaleData(localeBr);

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [
    DashboardComponent,
    ValidationComponent,
    TransmissionComponent,
    EventMonitorComponent,
    TafFiscalComponent,
    StatusEnvironmentReinfComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    TafFiscalRountingModule,
    PoPageModule,
    PoButtonModule,
    PoLoadingModule,
    PoContainerModule,
    PoTooltipModule,
    CoreModule,
    SharedModule,
    TransmissionPendingTableModule,
    TransmissionPendingTableDetailModule,
    TransmissionPendingTableDetailSecondLevelModule,
    SendEventModule,
    ClosingEventModule,
    SendValidationModule,
    PoTagModule,
    PoModalModule,
    ReportsModule,
    ExportReportModule,
    ValidationPendingTableModule,
    ValidationPendingTableDetailModule,
    ValidationPendingTableDetailSecondLevelModule,
    ButtonBackModule,
    TsiMonitorModule,
    SmartViewMonitorModule,
    EventStatusCardListModule,
    PoTableModule,
    EventMonitorTableModule,
    DeleteEventDialogModule,
    PoDropdownModule,
    DivergentDocumentsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class TafFiscalModule {}
