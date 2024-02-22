import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoWidgetModule, PoModalModule } from '@po-ui/ng-components';

import { FgtsReportCardComponent } from './fgts-report-card.component';
import { FgtsReportCardSyntheticDashboardModule } from './fgts-report-card-synthetic-dashboard/fgts-report-card-synthetic-dashboard.module';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    FgtsReportCardComponent
  ],
  imports: [
    CommonModule,
    PoWidgetModule,
    PoModalModule,
    FgtsReportCardSyntheticDashboardModule
  ],
  exports: [
    FgtsReportCardComponent
  ]
})

export class FgtsReportCardModule { }
