import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TafFiscalComponent } from './taf-fiscal.component';
import { PageNotFoundComponent } from 'core/errors/page-not-found/page-not-found.component';
import { DashboardComponent } from './reinf/dashboard/dashboard.component';
import { TransmissionComponent } from './reinf/dashboard/transmission/transmission.component';
import { EventMonitorComponent } from './reinf/dashboard/event-monitor/event-monitor.component';
import { ReportsComponent } from './reinf/reports/reports.component';
import { ValidationComponent } from './reinf/dashboard/validation/validation.component';
import { TsiMonitorComponent } from './tsi/monitor/tsi-monitor.component';
import { TsiDivergentDocumentsComponent } from './tsi/divergent-documents/tsi-divergent-documents.component';
import { LacsComponent } from './lalur-lacs/lacs/lacs.component';
import { LalurComponent } from './lalur-lacs/lalur/lalur.component';
import { SmartViewMonitorComponent } from './smart-view/monitor/sv-monitor.component';

const tafFiscalRoutes: Routes = [
  {
    path: 'eventsMonitor', component: TafFiscalComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'validation', component: ValidationComponent },
      { path: 'transmission', component: TransmissionComponent },
      { path: 'event-monitor', component: EventMonitorComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'eventsReport', component: TafFiscalComponent,
    children: [
      { path: '', component: ReportsComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'lalur', component: TafFiscalComponent,
    children: [
      { path: '', component: LalurComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'lacs', component: TafFiscalComponent,
    children: [
      { path: '', component: LacsComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'tsiMonitor', component: TsiMonitorComponent,
    children: [
      { path: '', component: TsiMonitorComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'smartViewMonitor', component: SmartViewMonitorComponent,
    children: [
      { path: '', component: SmartViewMonitorComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'tsiDivergentDocuments', component: TsiDivergentDocumentsComponent,

    children: [
      { path: '', component: TsiDivergentDocumentsComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(tafFiscalRoutes)],
  exports: [RouterModule]
})

export class TafFiscalRountingModule { }
