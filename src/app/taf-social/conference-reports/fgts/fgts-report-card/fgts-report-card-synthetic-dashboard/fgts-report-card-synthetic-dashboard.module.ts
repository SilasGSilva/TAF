import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoModalModule, PoChartModule, PoTableModule, PoContainerModule } from '@po-ui/ng-components';

import { FgtsReportCardSyntheticDashboardComponent } from './fgts-report-card-synthetic-dashboard.component';
import { FgtsReportSyntheticChartComponent } from './fgts-report-synthetic-chart/fgts-report-synthetic-chart.component';
import { FgtsReportSyntheticTableComponent } from './fgts-report-synthetic-table/fgts-report-synthetic-table.component';

@NgModule({
  declarations: [
    FgtsReportCardSyntheticDashboardComponent,
    FgtsReportSyntheticChartComponent,
    FgtsReportSyntheticTableComponent
  ],
  imports: [
    CommonModule,
    PoModalModule,
    PoChartModule,
    PoTableModule,
    PoContainerModule
  ],
  exports: [
    FgtsReportCardSyntheticDashboardComponent,
    FgtsReportSyntheticChartComponent,
    FgtsReportSyntheticTableComponent
  ]
})

export class FgtsReportCardSyntheticDashboardModule {}
