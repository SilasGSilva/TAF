import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoModalModule, PoChartModule, PoTableModule, PoContainerModule } from '@po-ui/ng-components';

import { InssReportCardSyntheticDashboardComponent } from './inss-report-card-synthetic-dashboard.component';
import { InssReportSyntheticChartComponent } from './inss-report-synthetic-chart/inss-report-synthetic-chart.component';
import { InssReportSyntheticTableComponent } from './inss-report-synthetic-table/inss-report-synthetic-table.component';

@NgModule({
  declarations: [
    InssReportCardSyntheticDashboardComponent,
    InssReportSyntheticChartComponent,
    InssReportSyntheticTableComponent
  ],
  imports: [
    CommonModule,
    PoModalModule,
    PoChartModule,
    PoTableModule,
    PoContainerModule
  ],
  exports: [
    InssReportCardSyntheticDashboardComponent,
    InssReportSyntheticChartComponent,
    InssReportSyntheticTableComponent
  ]
})

export class InssReportCardSyntheticDashboardModule {}
