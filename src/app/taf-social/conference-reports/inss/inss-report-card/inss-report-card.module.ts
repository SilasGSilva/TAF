import { Injectable } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PoWidgetModule, PoModalModule} from '@po-ui/ng-components';

import { InssReportCardComponent } from './inss-report-card.component';
import { InssReportCardSyntheticDashboardModule } from './inss-report-card-synthetic-dashboard/inss-report-card-synthetic-dashboard.module';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    InssReportCardComponent
  ],
  imports: [
    CommonModule,
    PoWidgetModule,
    PoModalModule,
    InssReportCardSyntheticDashboardModule
  ],
  exports: [
    InssReportCardComponent
  ]
})

export class InssReportCardModule { }
